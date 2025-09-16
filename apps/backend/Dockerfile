FROM php:8.4-fpm

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev libsqlite3-dev \
    && docker-php-ext-configure pgsql \
    && docker-php-ext-install -j$(nproc) pgsql pdo_pgsql pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 9000



