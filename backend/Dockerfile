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

# Create required directories BEFORE copying files (ensures they exist and are writable)
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/testing storage/framework/views storage/logs bootstrap/cache

# Set permissions EARLY (before any composer operations)
RUN chown -R www-data:www-data /var/www && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Copy startup script first
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Copy all files
COPY . .

# Fix permissions again after copy
RUN chown -R www-data:www-data /var/www && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Switch to www-data for composer and runtime
USER www-data

# Install dependencies (now with correct permissions)
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Switch back to root for CMD (some operations need root)
USER root

# Expose port
EXPOSE 10000

# Start the application
CMD ["/start.sh"]
