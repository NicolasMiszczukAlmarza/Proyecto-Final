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
use Illuminate\Support\Facades\Log;
use App\Models\Pedido;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StockController;

Route::middleware(['web'])->group(function () {

    Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('csrf-cookie');

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

    Route::post('/logout', function () {
        Auth::logout();
        return response()->json(['message' => 'Logout exitoso']);
    });

    Route::post('/register', [RegisterController::class, 'store']);

    Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => response()->json($request->user()));

    Route::middleware('auth:sanctum')->get('/usuarios', function () {
        return User::where('email', '!=', 'nicoadmin@admin.com')
            ->get(['id', 'name', 'last_name', 'email', 'roles']);
    });

    Route::middleware('auth:sanctum')->post('/convertir-admin', function (Request $request) {
        $request->validate(['email' => 'required|email|exists:users,email']);
        $user = User::where('email', $request->email)->first();
        $user->roles = 'admin';
        $user->save();
        return response()->json(['message' => 'Usuario promovido a administrador']);
    });

    Route::middleware('auth:sanctum')->post('/quitar-admin', function (Request $request) {
        $request->validate(['email' => 'required|email|exists:users,email']);
        $user = User::where('email', $request->email)->first();
        $user->roles = 'normal';
        $user->save();
        return response()->json(['message' => 'Usuario convertido a rol normal']);
    });

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

        $user->fill($validated)->save();

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'profile_image' => $user->profile_image ?? 'img/usuario/principal.png',
        ]);
    });

    Route::middleware('auth:sanctum')->post('/pedidos', [PedidoController::class, 'store']);
    Route::middleware('auth:sanctum')->get('/pedidos-usuario/{correo}', [PedidoController::class, 'pedidosUsuario']);

    Route::post('/forgot-password', function (Request $request) {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));
        return response()->json(['message' => $status === Password::RESET_LINK_SENT ? 'Correo de recuperación enviado.' : 'Error al enviar correo.']);
    });

    Route::post('/reset-password', function (Request $request) {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            fn ($user, $password) => $user->forceFill(['password' => bcrypt($password)])->save()
        );

        return response()->json(['message' => $status === Password::PASSWORD_RESET ? 'Contraseña cambiada correctamente.' : __($status)]);
    });

    Route::get('/reset-password/{token}', function (Request $request, $token) {
        return redirect("http://localhost:5173/reset-password?token=$token&email=" . $request->query('email'));
    });

    Route::get('/', fn () => view('welcome'));

    Route::middleware('auth:sanctum')->post('/agregar-producto', [ProductoController::class, 'store']);
    Route::get('/categorias', fn () => Categoria::all(['id', 'nombre']));
    Route::get('/productos', fn () => \App\Models\Producto::all());

    Route::middleware('auth:sanctum')->post('/editar-producto/{id}', function (Request $request, $id) {
        $producto = \App\Models\Producto::findOrFail($id);
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'stock' => 'required|integer',
            'id_categoria' => 'required|integer|exists:categorias,id',
            'img' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('img')) {
            if ($producto->img && file_exists(public_path($producto->img))) {
                @unlink(public_path($producto->img));
            }
            $imagen = $request->file('img');
            $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
            $imagen->move(public_path('uploads'), $nombreImagen);
            $producto->img = 'uploads/' . $nombreImagen;
        }

        $producto->fill($validated)->save();

        return response()->json(['message' => 'Producto actualizado']);
    });

    Route::middleware('auth:sanctum')->delete('/eliminar-producto/{id}', function ($id) {
        $producto = \App\Models\Producto::find($id);
        if (!$producto) return response()->json(['message' => 'Producto no encontrado'], 404);
        if ($producto->img && file_exists(public_path($producto->img))) {
            @unlink(public_path($producto->img));
        }
        $producto->delete();
        return response()->json(['message' => 'Producto eliminado correctamente']);
    });

    Route::middleware(['web', 'auth:sanctum'])->post('/renovar-stock', [StockController::class, 'renovar']);
    Route::middleware('auth:sanctum')->get('/resumen-financiero', [AdminController::class, 'resumenFinanciero']);

    // ---------- ELIMINAR CUENTA ----------
    Route::middleware('auth:sanctum')->delete('/eliminar-usuario', function (Request $request) {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['message' => 'Usuario no encontrado'], 404);

        if ($user->profile_image && $user->profile_image !== 'img/usuario/principal.png' && file_exists(public_path($user->profile_image))) {
            @unlink(public_path($user->profile_image));
        }

        $user->delete();
        return response()->json(['message' => 'Cuenta eliminada correctamente.']);
    });

});
