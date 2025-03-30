<?php

return [
    'paths' => ['login', 'logout', 'register', 'sanctum/csrf-cookie', 'pedidos'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
