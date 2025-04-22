<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration
    |--------------------------------------------------------------------------
    |
    | You may define the paths that will be accessible via CORS here.
    | For maximum compatibility, use a wildcard ('*') when necessary.
    |
    */

    'paths' => ['api/*', 'login', 'logout', 'register', 'sanctum/csrf-cookie', 'pedidos', '*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | Specify which HTTP methods are allowed for CORS requests.
    | You can set it to ['*'] to allow all methods.
    |
    */

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Here you can specify which origins are allowed to access your API.
    | Use ['*'] to accept requests from any origin.
    |
    */

    'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000', '*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins Patterns
    |--------------------------------------------------------------------------
    |
    | This is an additional check based on patterns for allowed origins.
    |
    */

    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Specify which headers are allowed during CORS requests.
    |
    */

'allowed_headers' => [
    'Content-Type',
    'X-Auth-Token',
    'Authorization',
    'Origin',
    'X-Requested-With',
    'Accept',
    'Access-Control-Allow-Credentials',
    'X-XSRF-TOKEN', // 👈 Agrega este
],


    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Specify headers that the browser is allowed to access from the response.
    |
    */

    'exposed_headers' => ['Authorization', 'Content-Type', 'X-Auth-Token', 'Origin'],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | The maximum duration in seconds that the response can be cached by the client.
    |
    */

    'max_age' => 86400,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Set to true to allow sending cookies or HTTP authentication along with the request.
    |
    */

    'supports_credentials' => true,

];
