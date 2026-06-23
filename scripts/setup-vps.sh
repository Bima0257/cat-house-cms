#!/bin/bash
set -e

export DEBIAN_FRONTEND=noninteractive
export TZ=Asia/Jakarta

echo "========== Cat House CMS — VPS Setup =========="

# 1. Set timezone & system update
ln -sf /usr/share/zoneinfo/Asia/Jakarta /etc/localtime
apt update && apt upgrade -y

# 2. Install dependencies
apt install -y nginx mysql-server git supervisor curl wget unzip

# 3. PHP 8.2
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
  sed -i "s/DB_CONNECTION=.*/DB_CONNECTION=mysql/" .env
  sed -i "s/# DB_HOST=.*/DB_HOST=127.0.0.1/" .env
  sed -i "s/# DB_PORT=.*/DB_PORT=3306/" .env
  sed -i "s/# DB_DATABASE=.*/DB_DATABASE=cat_house/" .env
  sed -i "s/# DB_USERNAME=.*/DB_USERNAME=cat_house/" .env
  sed -i "s/# DB_PASSWORD=.*/DB_PASSWORD=KosongSemua/" .env
  sed -i "s/APP_URL=.*/APP_URL=http:\/\/$(curl -s ifconfig.me)/" .env
  php artisan key:generate
  echo ".env created and configured"
else
  echo ".env already exists, skipping"
fi

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
npm ci
npm run build

# 12. Setup Nginx
echo ""
echo "========== Setup Nginx =========="
cat > /etc/nginx/sites-available/cat-house << 'NGINX_CONF'
server {
    listen 80;
    server_name _;
    root /var/www/cat-house-cms/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location /storage/ {
        alias /var/www/cat-house-cms/backend/storage/app/public/;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX_CONF

ln -sf /etc/nginx/sites-available/cat-house /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 13. Setup Supervisor (queue worker)
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

# 14. Set permissions
echo ""
echo "========== Set Permissions =========="
chown -R www-data:www-data /var/www/cat-house-cms/backend/storage
chown -R www-data:www-data /var/www/cat-house-cms/backend/bootstrap/cache

echo ""
echo "========== Setup Complete! =========="
echo "IP: $(curl -s ifconfig.me)"
echo "Backend: http://$(curl -s ifconfig.me)/api/services/public"
echo ""
echo "Next steps:"
echo "1. Setup SSH key for GitHub Actions"
echo "2. Add GitHub Secrets (VPS_HOST, VPS_USER, SSH_PRIVATE_KEY)"
echo "3. Push code to main to trigger auto-deploy"
