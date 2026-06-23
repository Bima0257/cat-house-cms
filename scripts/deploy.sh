# #!/bin/bash
# set -e

# echo "========== Deploying Cat House CMS =========="
# cd /var/www/cat-house-cms

# git pull origin main

# # Create storage directories if missing
# mkdir -p backend/storage/framework/views
# mkdir -p backend/storage/framework/cache
# mkdir -p backend/storage/framework/sessions
# chmod -R 775 backend/storage/framework

# # Backend
# echo ""
# echo "--- Backend ---"
# cd backend
# composer install --no-dev --optimize-autoloader
# php artisan migrate --force
# php artisan optimize:clear
# php artisan optimize

# # Frontend
# echo ""
# echo "--- Frontend ---"
# cd ../frontend
# npm ci
# npm run build

# # Restart services
# echo ""
# echo "--- Restart Services ---"
# systemctl reload php8.2-fpm
# supervisorctl restart cat-house-worker:*

# echo ""
# echo "========== Deploy Complete =========="


name: Deploy Cat House CMS

on:
  push:
    branches:
      - main # Skrip berjalan otomatis saat kamu push ke branch main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Jalankan Perintah Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.VPS_PORT }} # <-- KUNCI UTAMA UNTUK NAT VPS
          script_stop: true # <-- Pengganti 'set -e', jika ada command yang gagal, proses langsung stop
          script: |
            echo "========== Deploying Cat House CMS =========="
            cd /var/www/cat-house-cms

            # Ambil kode terbaru dari GitHub ke VPS
            git pull origin main

            # Buat direktori storage jika belum ada
            mkdir -p backend/storage/framework/views
            mkdir -p backend/storage/framework/cache
            mkdir -p backend/storage/framework/sessions
            chmod -R 775 backend/storage/framework

            # --- Backend Laravel ---
            echo ""
            echo "--- Backend ---"
            cd backend
            composer install --no-dev --optimize-autoloader
            php artisan migrate --force
            php artisan optimize:clear
            php artisan optimize

            # --- Frontend Node.js ---
            echo ""
            echo "--- Frontend ---"
            cd ../frontend
            npm ci
            npm run build

            # --- Restart Services ---
            echo ""
            echo "--- Restart Services ---"
            systemctl reload php8.2-fpm
            supervisorctl restart cat-house-worker:*

            echo ""
            echo "========== Deploy Complete =========="