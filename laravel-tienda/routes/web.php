<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\PedidoController;  // Importamos el controlador
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// 📌 Agrupar rutas dentro del middleware 'web' para manejar sesiones correctamente
Route::middleware(['web'])->group(function () {

    // 📌 Obtener el token CSRF (necesario para sesiones con Sanctum)
    Route::get('sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('csrf-cookie');

    // 📌 Ruta para iniciar sesión con Laravel Sanctum
    Route::post('/login', function (Request $request) {
        // Validar datos
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Buscar usuario por email
        $user = User::where('email', $credentials['email'])->first();

        // Verificar si el usuario existe y si la contraseña es correcta
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Usuario no registrado o contraseña incorrecta'], 401);
        }

        // Autenticar usuario con Sanctum (basado en sesión)
        Auth::login($user, true);

        return response()->json([
            'message' => 'Login exitoso',
            'user' => Auth::user(),
        ], 200);
    })->name('login');

    // 📌 Ruta para cerrar sesión
    Route::post('/logout', function () {
        Auth::logout();
        return response()->json(['message' => 'Logout exitoso'], 200);
    })->name('logout');

    // 📌 Obtener el usuario autenticado
    Route::get('/user', function (Request $request) {
        return response()->json(Auth::user());
    })->name('user');

    // 📌 Página de registro
    Route::get('/register', function () {
        return view('auth.register');
    })->name('register');

    // 📌 Procesar el registro del usuario
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

    // 📌 Ruta raíz
    Route::get('/', function () {
        return view('welcome'); // Página principal
    });

    // 📌 Ruta para manejar errores si se hace un GET en /login
    Route::get('/login', function () {
        return response()->json(['message' => 'Esta ruta solo acepta POST'], 405);
    });

    // 📌 Ruta para registrar pedidos usando el controlador
    Route::post('/pedidos', [PedidoController::class, 'store']);
});
