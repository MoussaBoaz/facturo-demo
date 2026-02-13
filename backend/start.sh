#!/bin/bash

set -e

echo "🚀 Starting Facturo API..."

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    export APP_KEY=$(php -r "echo base64_encode(random_bytes(32));")
fi

# Create .env file if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    sed -i "s/APP_KEY=/APP_KEY=base64:$APP_KEY/" .env
fi

# Run composer scripts
echo "Running composer scripts..."
composer run-script post-autoload-dump 2>/dev/null || true

# Wait for database to be ready
echo "Waiting for database..."
max_retries=30
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if php artisan migrate:status > /dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    echo "⏳ Database not ready yet, retrying... ($retry_count/$max_retries)"
    retry_count=$((retry_count + 1))
    sleep 2
done

if [ $retry_count -eq $max_retries ]; then
    echo "❌ Database connection failed after $max_retries attempts"
    # Continue anyway, maybe DB will be ready later
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force || true

# Cache config and routes
echo "Caching config and routes..."
php artisan config:cache || true
php artisan route:cache || true

# Start server
echo "🌐 Starting server on port 10000..."
php artisan serve --host 0.0.0.0 --port 10000
