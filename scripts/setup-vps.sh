#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
export TZ=Asia/Jakarta

# Domain configuration - GANTI INI DENGAN DOMAIN KAMU
DOMAIN="leondev.my.id"
EMAIL="admin@leondev.my.id"  # Email untuk Let's Encrypt notifications

echo "========== Cat House CMS — VPS Setup =========="

# 1. Set timezone & system update
ln -sf /usr/share/zoneinfo/Asia/Jakarta /etc/localtime
apt update
apt upgrade -y || true

# 2. Fix tzdata if stuck
dpkg --configure -a 2>/dev/null || true

# 3. Install dependencies
apt install -y nginx mysql-server git supervisor curl wget unzip software-properties-common

# 4. PHP 8.2
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php8.2-fpm php8.2-mysql php8.2-mbstring \
  php8.2-xml php8.2-curl php8.2-gd php8.2-zip php8.2-bcmath php8.2-intl

# 4. Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# 5. Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash
apt install -y nodejs

# 6. Clone repo
# Fix .env.example defaults before clone/setup
sed -i 's/CACHE_STORE=database/CACHE_STORE=file/' /var/www/cat-house-cms/backend/.env.example 2>/dev/null || true

mkdir -p /var/www
cd /var/www

if [ -d "cat-house-cms" ]; then
  echo "Repo already exists, pulling..."
  cd cat-house-cms && git pull origin main
else
  git clone https://github.com/Bima0257/cat-house-cms.git
  cd cat-house-cms
fi

# 7. Setup MySQL
echo ""
echo "========== Setup MySQL =========="
mysql <<EOF
CREATE DATABASE IF NOT EXISTS cat_house CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS cat_house@localhost IDENTIFIED BY 'KosongSemua';
GRANT ALL PRIVILEGES ON cat_house.* TO cat_house@localhost;
FLUSH PRIVILEGES;
EOF

# 8. Setup .env
echo ""
echo "========== Setup .env =========="
cd /var/www/cat-house-cms/backend

if [ ! -f ".env" ]; then
  cp .env.example .env
  sed -i "s|APP_URL=.*|APP_URL=https://${DOMAIN}|" .env
  php artisan key:generate
  echo ".env created and configured"
else
  echo ".env already exists, skipping"
fi

# Fix CACHE_STORE (example still uses 'database')
sed -i 's/CACHE_STORE=database/CACHE_STORE=file/' .env

# 9. Setup backend
echo ""
echo "========== Setup Backend =========="
cd /var/www/cat-house-cms/backend
composer install --no-dev --optimize-autoloader
php artisan storage:link
chmod -R 775 storage bootstrap/cache

# 10. Migrate
php artisan migrate --force

# 11. Setup frontend
echo ""
echo "========== Setup Frontend =========="
cd /var/www/cat-house-cms/frontend
export NODE_OPTIONS="--max-old-space-size=256"
npm ci
npm run build

# 12. Stop & disable Apache (if installed)
systemctl stop apache2 2>/dev/null || true
systemctl disable apache2 2>/dev/null || true

# 13. Setup Nginx
echo ""
echo "========== Setup Nginx (HTTP) =========="
cat > /etc/nginx/sites-available/cat-house << 'NGINX_CONF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    charset utf-8;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    # React Frontend SPA
    root /var/www/cat-house-cms/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Laravel API
    location /api/ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/cat-house-cms/backend/public/index.php;
        fastcgi_param SCRIPT_NAME /index.php;
    }

    location /sanctum/ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/cat-house-cms/backend/public/index.php;
        fastcgi_param SCRIPT_NAME /index.php;
    }

    location /storage/ {
        alias /var/www/cat-house-cms/backend/storage/app/public/;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX_CONF

# Replace placeholder with actual domain
sed -i "s/DOMAIN_PLACEHOLDER/${DOMAIN}/" /etc/nginx/sites-available/cat-house

ln -sf /etc/nginx/sites-available/cat-house /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 13b. Setup SSL with Let's Encrypt
echo ""
echo "========== Setup SSL with Let's Encrypt =========="
apt install -y certbot python3-certbot-nginx

# Stop nginx temporarily for certbot standalone mode
systemctl stop nginx

# Get SSL certificate
certbot certonly --standalone -d ${DOMAIN} --non-interactive --agree-tos -m ${EMAIL} --pre-hook "systemctl stop nginx" --post-hook "systemctl start nginx"

# Create Nginx config with SSL
cat > /etc/nginx/sites-available/cat-house-ssl << 'NGINX_SSL_CONF'
server {
    listen 80;
    server_name DOMAIN_SSL_PLACEHOLDER;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name DOMAIN_SSL_PLACEHOLDER;
    charset utf-8;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/DOMAIN_SSL_PLACEHOLDER/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_SSL_PLACEHOLDER/privkey.pem;

    # SSL Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # React Frontend SPA
    root /var/www/cat-house-cms/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Laravel API
    location /api/ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/cat-house-cms/backend/public/index.php;
        fastcgi_param SCRIPT_NAME /index.php;
    }

    location /sanctum/ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/cat-house-cms/backend/public/index.php;
        fastcgi_param SCRIPT_NAME /index.php;
    }

    location /storage/ {
        alias /var/www/cat-house-cms/backend/storage/app/public/;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX_SSL_CONF

# Replace placeholder with actual domain
sed -i "s/DOMAIN_SSL_PLACEHOLDER/${DOMAIN}/g" /etc/nginx/sites-available/cat-house-ssl

# Enable SSL config and disable HTTP-only
ln -sf /etc/nginx/sites-available/cat-house-ssl /etc/nginx/sites-enabled/cat-house
rm -f /etc/nginx/sites-enabled/cat-house

# Setup auto-renewal cron job for SSL certificate
(crontab -l 2>/dev/null; echo "0 0 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'") | crontab -

nginx -t && systemctl reload nginx

echo "SSL certificate installed and auto-renewal configured!"

# 14. Create storage framework directories
mkdir -p /var/www/cat-house-cms/backend/storage/framework/views
mkdir -p /var/www/cat-house-cms/backend/storage/framework/cache
mkdir -p /var/www/cat-house-cms/backend/storage/framework/sessions
chmod -R 775 /var/www/cat-house-cms/backend/storage/framework

# 15. Setup Supervisor (queue worker)
echo ""
echo "========== Setup Supervisor =========="
cat > /etc/supervisor/conf.d/cat-house-worker.conf << 'SUPERVISOR_CONF'
[program:cat-house-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/cat-house-cms/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/cat-house-cms/backend/storage/logs/worker.log
stopwaitsecs=3600
SUPERVISOR_CONF

supervisorctl reread && supervisorctl update

# 16. Set permissions
echo ""
echo "========== Set Permissions =========="
chown -R www-data:www-data /var/www/cat-house-cms/backend/storage
chown -R www-data:www-data /var/www/cat-house-cms/backend/bootstrap/cache

echo ""
echo "========== Setup Complete! =========="
echo "Domain: https://${DOMAIN}"
echo "Backend API: https://${DOMAIN}/api/services/public"
echo ""
echo "SSL Certificate: Let's Encrypt (auto-renew enabled)"
echo "Certificate auto-renewal: Daily at 00:00"
echo ""
echo "Next steps:"
echo "1. Setup SSH key for GitHub Actions"
echo "2. Add GitHub Secrets (VPS_HOST, VPS_USER, SSH_PRIVATE_KEY)"
echo "3. Push code to main to trigger auto-deploy"
