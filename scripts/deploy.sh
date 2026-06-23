#!/bin/bash
set -e

echo "========== Deploying Cat House CMS =========="
cd /var/www/cat-house-cms

git pull origin main

# Create storage directories if missing
mkdir -p backend/storage/framework/views
mkdir -p backend/storage/framework/cache
mkdir -p backend/storage/framework/sessions
chmod -R 775 backend/storage/framework

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
export NODE_OPTIONS="--max-old-space-size=256"
npm ci
npm run build

# Restart services
echo ""
echo "--- Restart Services ---"
systemctl reload php8.2-fpm
supervisorctl restart cat-house-worker:*

echo ""
echo "========== Deploy Complete =========="