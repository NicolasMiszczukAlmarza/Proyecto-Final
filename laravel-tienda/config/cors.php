<?php

// config/cors.php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'register'],
    'allowed_origins' => ['*'],  // Permite cualquier origen (puedes limitarlo a tu frontend)
    'allowed_methods' => ['*'],  // Permite todos los métodos HTTP (GET, POST, etc.)
    'allowed_headers' => ['*'],  // Permite todos los encabezados
    'supports_credentials' => true,
    
];
