#!/bin/bash

# Copy .env if not present
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Inject APP_KEY if provided
if [ -n "$APP_KEY" ]; then
  sed -i "s|^APP_KEY=.*|APP_KEY=$APP_KEY|" .env
else
  if ! grep -q '^APP_KEY=' .env || grep -q 'APP_KEY=$' .env; then
    echo "Generating new app key..."
    php artisan key:generate
  fi
fi

php artisan config:cache

# Check if the database is ready
until php artisan migrate --force; do
  echo "Waiting for database to be ready..."
  sleep 2
done

php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

exec php artisan serve --host=0.0.0.0 --port=8000
