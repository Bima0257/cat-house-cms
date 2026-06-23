#!/bin/bash
set -e

echo "========== Deploying Cat House CMS =========="
cd /var/www/cat-house-cms

git pull origin main

# Backend
echo ""
echo "--- Backend ---"
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize:clear
php artisan optimize

# Frontend
echo ""
echo "--- Frontend ---"
cd ../frontend
npm ci
npm run build

# Restart services
echo ""
echo "--- Restart Services ---"
sudo systemctl reload php8.2-fpm
sudo supervisorctl restart cat-house-worker:*

echo ""
echo "========== Deploy Complete =========="
