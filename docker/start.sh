#!/bin/bash
set -e

echo "Starting deployment..."

# Wait for database to be ready
echo "Waiting for database..."
sleep 5

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Clear all caches first (ignore errors if they don't exist)
echo "Clearing caches..."
php artisan cache:clear || true
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Optimize application
echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start supervisor
echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
