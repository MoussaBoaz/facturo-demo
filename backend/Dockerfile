FROM php:8.4-cli

# Install dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Create startup script
RUN echo '#!/bin/bash\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan migrate --force\n\
php artisan serve --host 0.0.0.0 --port 10000\n\
' > /start.sh && chmod +x /start.sh

EXPOSE 10000

# Start the application
CMD ["/start.sh"]
