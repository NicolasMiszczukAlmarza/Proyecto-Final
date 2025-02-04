<?php

// config/cors.php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Incluir la ruta de CSRF
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'], // El puerto de tu frontend
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,  // Muy importante para permitir cookies
];
