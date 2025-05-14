<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Arr;

use App\Models\User;
use App\Models\Producto;
use App\Models\Categoria;
use App\Http\Controllers\{
    Auth\RegisterController,
    ProductoController,
    PedidoController,
    UsuarioController,
    StockController,
    AdminController
};

use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

/*
|--------------------------------------------------------------------------
| Rutas públicas
|--------------------------------------------------------------------------
*/
Route::middleware('web')->group(function () {
    Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('csrf-cookie');

    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        Auth::login($user, true);
        return response()->json(['message' => 'Login exitoso', 'user' => $user]);
    });

    Route::post('/logout', function () {
        Auth::logout();
        return response()->json(['message' => 'Logout exitoso']);
    });

    Route::post('/register', [RegisterController::class, 'store']);

    Route::post('/forgot-password', function (Request $request) {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));

        return response()->json(['message' =>
            $status === Password::RESET_LINK_SENT
                ? 'Correo de recuperación enviado.'
                : 'Error al enviar el correo.'
        ]);
    });

    Route::post('/reset-password', function (Request $request) {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            fn ($user, $password) => $user->forceFill(['password' => bcrypt($password)])->save()
        );

        return response()->json(['message' =>
            $status === Password::PASSWORD_RESET
                ? 'Contraseña cambiada correctamente.'
                : __($status)
        ]);
    });

    Route::get('/reset-password/{token}', function (Request $request, $token) {
        return redirect("http://localhost:5173/reset-password?token=$token&email=" . $request->query('email'));
    });

    Route::get('/', fn () => view('welcome'));
});

/*
|--------------------------------------------------------------------------
| Rutas protegidas (requieren autenticación)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Usuario
    Route::get('/usuario', [UsuarioController::class, 'show']);
    Route::post('/usuario/actualizar', [UsuarioController::class, 'update']);
    Route::delete('/usuario/eliminar', [UsuarioController::class, 'destroy']);


    // Productos
    Route::get('/productos', fn () => Producto::all());
    Route::post('/agregar-producto', [ProductoController::class, 'store']);
    Route::post('/editar-producto/{id}', [ProductoController::class, 'update']);
    Route::delete('/eliminar-producto/{id}', [ProductoController::class, 'destroy']);

    // Categorías
    Route::get('/categorias', fn () => Categoria::all(['id', 'nombre']));

    // Pedidos
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::get('/pedidos-usuario/{correo}', [PedidoController::class, 'pedidosUsuario']);

    // Finanzas / Stock
    Route::post('/renovar-stock', [StockController::class, 'renovar']);
    Route::get('/resumen-financiero', [AdminController::class, 'resumenFinanciero']);

    // Usuarios
    Route::get('/usuarios', fn () =>
        User::where('email', '!=', 'nicoadmin@admin.com')->get(['id', 'name', 'last_name', 'email', 'roles'])
    );

    // Rutas administrativas
    Route::prefix('admin')->group(function () {
        Route::post('/convertir-admin', [AdminController::class, 'convertirAdmin']);
        Route::post('/quitar-admin', [AdminController::class, 'quitarAdmin']);
        Route::delete('/eliminar', [AdminController::class, 'eliminarUsuario']);
    });
});
