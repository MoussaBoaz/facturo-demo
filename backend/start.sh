#!/bin/bash

set -e

echo "🚀 Starting Facturo API..."

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    export APP_KEY="base64:"$(php -r "echo base64_encode(random_bytes(32));")
fi

# Create .env file with Render's environment variables
echo "Creating .env file..."
cat > .env << EOF
APP_NAME=Facturo
APP_ENV=production
APP_KEY=${APP_KEY}
APP_DEBUG=false
APP_URL=${APP_URL:-https://facturo-api.onrender.com}

LOG_CHANNEL=stderr
LOG_LEVEL=debug

DB_CONNECTION=${DB_CONNECTION:-pgsql}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE:-facturo}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

JWT_SECRET=${JWT_SECRET:-$(php -r "echo base64_encode(random_bytes(32));" | tr -d '\n')}
EOF

echo "✅ .env file created"
echo "DB_HOST: $DB_HOST"
echo "DB_DATABASE: $DB_DATABASE"

# Run composer scripts
echo "Running composer scripts..."
composer run-script post-autoload-dump 2>/dev/null || true

# Wait for database to be ready
echo "Waiting for database at $DB_HOST:$DB_PORT..."
max_retries=30
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    # Test database connection using PHP
    if php -r "
        try {
            \$pdo = new PDO('pgsql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD');
            echo 'DB_OK';
        } catch (Exception \$e) {
            echo 'DB_FAIL: ' . \$e->getMessage();
        }
    " 2>/dev/null | grep -q "DB_OK"; then
        echo "✅ Database is ready!"
        break
    fi
    
    echo "⏳ Database not ready yet, retrying... ($retry_count/$max_retries)"
    retry_count=$((retry_count + 1))
    sleep 2
done

if [ $retry_count -eq $max_retries ]; then
    echo "❌ Database connection failed after $max_retries attempts"
    echo "Trying to continue anyway..."
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force || echo "⚠️ Migration failed or already done"

# Cache config and routes
echo "Caching config and routes..."
php artisan config:cache || true
php artisan route:cache || true

# Start server
echo "🌐 Starting server on port 10000..."
php artisan serve --host 0.0.0.0 --port 10000
