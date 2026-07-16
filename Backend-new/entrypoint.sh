#!/bin/sh

set -e

php artisan config:clear

php artisan config:cache

until php artisan migrate --force
do
    echo "Waiting for database..."
    sleep 2
done

php artisan storage:link || true

exec php artisan serve \
    --host=0.0.0.0 \
    --port=$PORT
