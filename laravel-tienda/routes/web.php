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

// ----- Grupo para rutas que usan sesión, cookies y Sanctum -----
Route::middleware(['web'])->group(function () {

    // --------- CSRF para Sanctum (obligatorio en SPA) ---------
    Route::get('sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('csrf-cookie');

    // --------- LOGIN ---------
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

    // --------- LOGOUT ---------
    Route::post('/logout', function () {
        Auth::logout();
        return response()->json(['message' => 'Logout exitoso']);
    });

    // --------- REGISTRO ---------
    Route::post('/register', [RegisterController::class, 'store']);

    // --------- OBTENER USUARIO AUTENTICADO ---------
    Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // --------- ACTUALIZAR DATOS DEL USUARIO AUTENTICADO ---------
    Route::post('/actualizar-usuario', function (Request $request) {
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
    })->middleware('auth:sanctum');

    // --------- GUARDAR UN NUEVO PEDIDO ---------
    Route::post('/pedidos', [PedidoController::class, 'store'])->middleware('auth:sanctum');

    // --------- OBTENER TODOS LOS PEDIDOS DE UN USUARIO POR SU CORREO (CON JOIN PRODUCTO) ---------
    Route::get('/pedidos-usuario/{correo}', [PedidoController::class, 'pedidosUsuario'])->middleware('auth:sanctum');

    // ===========================
    //   RECUPERACIÓN DE CONTRASEÑA
    // ===========================

    // 1. Solicitar envío de email para recuperar contraseña
    Route::post('/forgot-password', function (Request $request) {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return response()->json([
            'message' => $status === Password::RESET_LINK_SENT
                ? 'Hemos enviado un correo de recuperación si el email está registrado.'
                : 'No hemos podido enviar el correo de recuperación.'
        ]);
    });

    // 2. Cambiar la contraseña desde el enlace del email
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
                ? 'La contraseña ha sido cambiada correctamente.'
                : __($status),
        ]);
    });

    // 3. Ruta que Laravel necesita para poner el enlace en el correo (¡ES OBLIGATORIA!)
    Route::get('/reset-password/{token}', function (Request $request, $token) {
        // Redirige a tu frontend con token y email
        return redirect("http://localhost:5173/reset-password?token=$token&email=" . $request->query('email'));
    });

    // --------- (Opcional) Ruta principal de bienvenida ----------
    Route::get('/', fn () => view('welcome'));
});
