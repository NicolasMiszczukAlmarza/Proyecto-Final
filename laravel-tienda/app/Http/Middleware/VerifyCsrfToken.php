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
        'convertir-admin',
        'quitar-admin',
        'agregar-producto',
        'editar-producto/*',
        'productos',
        'eliminar-producto/*',
    ];
    
}
