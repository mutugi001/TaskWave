<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['*','sanctum/csrf-cookie','api/*','api/login','api/logout','api/register','api/forgot-password','api/reset-password'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['https://taskwave.mutugitech.co.ke','capacitor://localhost',
    'https://localhost',
    'https://localhost:8080',
    'https://localhost:3000',
    'http://localhost:5173'],

    'allowed_origins_patterns' => ['*'],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
