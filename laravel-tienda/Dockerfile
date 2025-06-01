FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    bash \
    oniguruma-dev \
    libxml2-dev \
    sqlite-dev \
    zip \
    unzip \
    curl \
    nginx \
    supervisor \
    && docker-php-ext-install pdo pdo_sqlite mbstring xml

WORKDIR /var/www

COPY . .

# Opcional: instalar Composer y dependencias
# RUN curl -sS https://getcomposer.org/installer | php && \
#     mv composer.phar /usr/local/bin/composer && \
#     composer install --no-interaction --prefer-dist --optimize-autoloader

# Solo funciona si `.env` existe y el vendor está instalado
# RUN php artisan config:cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-n"]
