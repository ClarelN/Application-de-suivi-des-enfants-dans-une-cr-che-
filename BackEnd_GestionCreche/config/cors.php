<?php

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    /*
    | En développement : FRONTEND_URL=* dans .env
    | En production    : FRONTEND_URL=https://votre-domaine.com
    */
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    /*
    | Garder à false si l'auth se fait par Bearer token (header Authorization).
    | Passer à true uniquement si vous utilisez Sanctum en mode cookie/SPA.
    */
    'supports_credentials' => false,
];
