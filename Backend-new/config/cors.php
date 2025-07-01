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

    'allowed_origins' => [ENV('FRONTEND_URL'),'https://taskwave.jhubafrica.com', 'https://www.taskwave.jhubafrica.com', 'https://localhost:8081'],

    'allowed_origins_patterns' => ['*'],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
