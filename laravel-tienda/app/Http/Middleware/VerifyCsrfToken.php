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
        'agregar-producto',
        'editar-producto/*',
        'eliminar-producto/*',
        'productos',
        'renovar-stock',              // 👈 Añade esta si no está
        'user/update',
        'user/actualizar',
        'admin/convertir-admin',
        'admin/quitar-admin',
        'admin/eliminar',
    ];
    
    
}
