<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// Rutas para CSRF
Route::get('sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('csrf-cookie');

// Rutas del registro bajo el middleware 'web'
Route::middleware('web')->group(function () {
    Route::get('register', [UsuarioController::class, 'showForm'])->name('register.form');
    Route::post('register', [UsuarioController::class, 'store'])->name('register.store');
});
