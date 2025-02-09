<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// Mostrar el formulario de registro
Route::get('/register', function () {
    return view('auth.register');
})->name('register'); // <-- Se agrega el nombre de la ruta

// Procesar el registro del usuario
Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

// Ruta para obtener el token CSRF
Route::get('sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('csrf-cookie');

// Ruta raíz
Route::get('/', function () {
    return view('welcome'); // Página principal
});
