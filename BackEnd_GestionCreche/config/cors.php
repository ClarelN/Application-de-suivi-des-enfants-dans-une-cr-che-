<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Chemins protégés par CORS
    |--------------------------------------------------------------------------
    | 'api/*' couvre toutes les routes API ainsi que les preflight OPTIONS.
    | 'sanctum/csrf-cookie' est utile si vous passez un jour en mode SPA/cookie.
    */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Origines autorisées
    |--------------------------------------------------------------------------
    | Vite tourne sur 5173 par défaut. En prod, remplacez par votre domaine.
    | La variable FRONTEND_URL dans .env prend le dessus.
    */
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    /*
    |--------------------------------------------------------------------------
    | Credentials
    |--------------------------------------------------------------------------
    | Garder à false : l'auth est par Bearer token (header Authorization).
    | Ne passer à true que pour le mode cookie/SPA Sanctum.
    */
    'supports_credentials' => false,

];
