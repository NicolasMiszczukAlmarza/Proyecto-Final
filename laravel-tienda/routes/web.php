<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Arr;

use App\Models\User;
use App\Models\Categoria;
use App\Models\Pedido;
use App\Models\Producto;

use App\Http\Controllers\{
    UsuarioController,
    Auth\RegisterController,
    PedidoController,
    ProductoController,
    AdminController,
    StockController
};
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::middleware('web')->group(function () {

    Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('csrf-cookie');

    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Usuario o contraseña incorrectos'], 401);
        }

        Auth::login($user, true);
        return response()->json(['message' => 'Login exitoso', 'user' => $user]);
    });

    Route::post('/logout', fn () => tap(Auth::logout(), fn () =>
        response()->json(['message' => 'Logout exitoso'])
    ));

    Route::post('/register', [RegisterController::class, 'store']);

    Route::prefix('user')->middleware('auth:sanctum')->group(function () {
        Route::get('/', [UsuarioController::class, 'show']);
        Route::post('/actualizar', [UsuarioController::class, 'update']);

        Route::get('/lista', fn () =>
            User::where('email', '!=', 'nicoadmin@admin.com')
                ->get(['id', 'name', 'last_name', 'email', 'roles'])
        );

        Route::post('/convertir-admin', function (Request $r) {
            $r->validate(['email' => 'required|email|exists:users,email']);
            User::where('email', $r->email)->update(['roles' => 'admin']);
            return response()->json(['message' => 'Usuario promovido a administrador']);
        });

        Route::post('/quitar-admin', function (Request $r) {
            $r->validate(['email' => 'required|email|exists:users,email']);
            User::where('email', $r->email)->update(['roles' => 'normal']);
            return response()->json(['message' => 'Rol de administrador retirado']);
        });

        Route::delete('/eliminar', function (Request $r) {
            $r->validate(['email' => 'required|email']);
            $user = User::where('email', $r->email)->first();

            if (!$user) return response()->json(['message' => 'Usuario no encontrado'], 404);

            if ($user->profile_image &&
                $user->profile_image !== 'img/usuario/principal.png' &&
                file_exists(public_path($user->profile_image))) {
                @unlink(public_path($user->profile_image));
            }

            $user->delete();
            return response()->json(['message' => 'Cuenta eliminada correctamente.']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/pedidos', [PedidoController::class, 'store']);
        Route::get('/pedidos-usuario/{correo}', [PedidoController::class, 'pedidosUsuario']);
    });

    Route::post('/forgot-password', function (Request $r) {
        $r->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($r->only('email'));

        return response()->json(['message' =>
            $status === Password::RESET_LINK_SENT
                ? 'Correo de recuperación enviado.'
                : 'Error al enviar correo.'
        ]);
    });

    Route::post('/reset-password', function (Request $r) {
        $r->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $r->only('email', 'password', 'password_confirmation', 'token'),
            fn ($u, $p) => $u->forceFill(['password' => bcrypt($p)])->save()
        );

        return response()->json(['message' =>
            $status === Password::PASSWORD_RESET
                ? 'Contraseña cambiada correctamente.'
                : __($status)
        ]);
    });

    Route::get('/reset-password/{token}', fn (Request $r, $token) =>
        redirect("http://localhost:5173/reset-password?token=$token&email=" . $r->query('email'))
    );

    Route::get('/categorias', fn () => Categoria::all(['id', 'nombre']));
    Route::get('/productos', fn () => Producto::all());

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/agregar-producto', [ProductoController::class, 'store']);

        Route::post('/editar-producto/{id}', function (Request $r, $id) {
            $producto = Producto::findOrFail($id);

            $validated = $r->validate([
                'nombre'       => 'required|string|max:255',
                'descripcion'  => 'required|string',
                'precio'       => 'required|numeric',
                'stock'        => 'required|integer',
                'id_categoria' => 'required|integer|exists:categorias,id',
                'img'          => 'nullable|image|max:2048',
            ]);

            $producto->fill(Arr::except($validated, ['img']));

            if ($r->hasFile('img')) {
                if ($producto->img && file_exists(public_path($producto->img))) {
                    @unlink(public_path($producto->img));
                }

                $img = $r->file('img');
                $fileName = time() . '_' . $img->getClientOriginalName();
                $dir = public_path('uploads');
                if (!is_dir($dir)) mkdir($dir, 0755, true);

                $img->move($dir, $fileName);
                $producto->img = "uploads/$fileName";
            }

            $producto->save();
            return response()->json(['message' => 'Producto actualizado']);
        });

        Route::delete('/eliminar-producto/{id}', function ($id) {
            $producto = Producto::find($id);
            if (!$producto) return response()->json(['message' => 'Producto no encontrado'], 404);

            if ($producto->img && file_exists(public_path($producto->img))) {
                @unlink(public_path($producto->img));
            }

            $producto->delete();
            return response()->json(['message' => 'Producto eliminado correctamente']);
        });
    });

    Route::middleware('auth:sanctum')->post('/renovar-stock', [StockController::class, 'renovar']);
    Route::middleware('auth:sanctum')->get('/resumen-financiero', [AdminController::class, 'resumenFinanciero']);

    Route::get('/', fn () => view('welcome'));
});