FROM php:8.4-fpm-alpine

WORKDIR /var/www/html

RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-configure pgsql \
    && docker-php-ext-install pgsql pdo_pgsql

EXPOSE 9000



