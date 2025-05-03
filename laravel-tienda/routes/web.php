<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\PedidoController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\ProductoController;
use App\Models\Categoria;

Route::middleware(['web'])->group(function () {

    // ---------- CSRF para Sanctum ----------
    Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('csrf-cookie');

    // ---------- LOGIN ----------
    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Usuario no registrado o contraseña incorrecta'], 401);
        }

        Auth::login($user, true);

        return response()->json([
            'message' => 'Login exitoso',
            'user' => Auth::user(),
        ]);
    });

    // ---------- LOGOUT ----------
    Route::post('/logout', function () {
        Auth::logout();
        return response()->json(['message' => 'Logout exitoso']);
    });

    // ---------- REGISTRO ----------
    Route::post('/register', [RegisterController::class, 'store']);

    // ---------- USUARIO ACTUAL ----------
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // ---------- OBTENER USUARIOS CON ROL NORMAL ----------
    // ✅ Devuelve todos los usuarios excepto el admin principal
Route::middleware('auth:sanctum')->get('/usuarios', function () {
    return User::where('email', '!=', 'nicoadmin@admin.com')
        ->get(['id', 'name', 'last_name', 'email', 'roles']);
});


    // ---------- CONVERTIR EN ADMIN ----------
    Route::middleware('auth:sanctum')->post('/convertir-admin', function (Request $request) {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        $user->roles = 'admin';
        $user->save();

        return response()->json(['message' => 'Usuario promovido a administrador']);
    });

    // ---------- QUITAR ADMIN Y CONVERTIR EN NORMAL ----------
    Route::middleware('auth:sanctum')->post('/quitar-admin', function (Request $request) {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        $user->roles = 'normal';
        $user->save();

        return response()->json(['message' => 'Usuario convertido a rol normal']);
    });

    // ---------- ACTUALIZAR USUARIO ----------
    Route::middleware('auth:sanctum')->post('/actualizar-usuario', function (Request $request) {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('profile_image')) {
            if (
                $user->profile_image &&
                $user->profile_image !== 'img/usuario/principal.png' &&
                file_exists(public_path($user->profile_image))
            ) {
                @unlink(public_path($user->profile_image));
            }

            $image = $request->file('profile_image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads'), $imageName);
            $user->profile_image = 'uploads/' . $imageName;
        }

        $user->name = $validated['name'];
        $user->last_name = $validated['last_name'];
        $user->address = $validated['address'];
        $user->save();

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'profile_image' => $user->profile_image ?? 'img/usuario/principal.png',
        ]);
    });

    // ---------- GUARDAR PEDIDO ----------
    Route::middleware('auth:sanctum')->post('/pedidos', [PedidoController::class, 'store']);

    // ---------- PEDIDOS POR USUARIO ----------
    Route::middleware('auth:sanctum')->get('/pedidos-usuario/{correo}', [PedidoController::class, 'pedidosUsuario']);

    // ---------- RECUPERAR CONTRASEÑA ----------
    Route::post('/forgot-password', function (Request $request) {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        return response()->json([
            'message' => $status === Password::RESET_LINK_SENT
                ? 'Correo de recuperación enviado.'
                : 'Error al enviar correo.'
        ]);
    });

    Route::post('/reset-password', function (Request $request) {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = bcrypt($password);
                $user->save();
            }
        );

        return response()->json([
            'message' => $status === Password::PASSWORD_RESET
                ? 'Contraseña cambiada correctamente.'
                : __($status),
        ]);
    });

    Route::get('/reset-password/{token}', function (Request $request, $token) {
        return redirect("http://localhost:5173/reset-password?token=$token&email=" . $request->query('email'));
    });

    // ---------- BIENVENIDA ----------
    Route::get('/', fn () => view('welcome'));

    // ---------- Agregar Productos ----------
    Route::middleware('auth:sanctum')->post('/agregar-producto', [ProductoController::class, 'store']);

 // ---------- Ver Categoria ----------
 Route::get('/categorias', function () {
    return \App\Models\Categoria::all(['id', 'nombre']);
});

 // ---------- Ver Productos ----------
Route::get('/productos', function () {
    return \App\Models\Producto::all();
});





});
