<?php

return [
    'paths' => ['login', 'logout', 'register', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
 'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000'],
'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
