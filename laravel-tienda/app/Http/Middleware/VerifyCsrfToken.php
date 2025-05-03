<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'login',
        'logout',
        'register',
        'sanctum/csrf-cookie',
        'pedidos',
        'actualizar-usuario',
        'forgot-password',
        'reset-password',
        'convertir-admin',   // ✅ para promover usuarios
        'quitar-admin',      // ✅ para degradar usuarios
        'agregar-producto', // ✅ para permitir POST sin token CSRF
        '/productos',
    ];
}
