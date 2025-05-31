#!/bin/bash

# Check if the database is ready
until php artisan migrate --force; do
  echo "Waiting for database to be ready..."
  sleep 2
done

exec php artisan serve --host=0.0.0.0 --port=8000
