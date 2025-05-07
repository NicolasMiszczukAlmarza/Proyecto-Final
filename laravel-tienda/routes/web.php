<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Arr;                        //  ← para Arr::except
use App\Models\User;
use App\Models\Categoria;
use App\Models\Pedido;
use App\Models\Producto;
use App\Http\Controllers\UsuarioController;

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StockController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

/* ----------------------------------------------------------------
|  Todas las rutas webs protegidas por el middleware 'web'
---------------------------------------------------------------- */
Route::middleware(['web'])->group(function () {

    /* ------------------------------------------------------------
     *  AUTENTICACIÓN BÁSICA
     * ---------------------------------------------------------- */
    Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class,'show'])->name('csrf-cookie');

    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $credentials['email'])->first();
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Usuario o contraseña incorrectos'], 401);
        }

        Auth::login($user, true);

        return response()->json([
            'message' => 'Login exitoso',
            'user'    => Auth::user(),
        ]);
    });

    Route::post('/logout', function () {
        Auth::logout();
        return response()->json(['message' => 'Logout exitoso']);
    });

    Route::post('/register', [RegisterController::class,'store']);

    /* ------------------------------------------------------------
     *  USUARIOS
     * ---------------------------------------------------------- */
    Route::middleware('auth:sanctum')->get('/user', function (Request $r) {
        $u = $r->user();
        if (str_starts_with($u->profile_image ?? '', 'C:')) {
            $u->profile_image = 'img/usuario/principal.png';
        }
        return response()->json($u);
    });
    

    Route::middleware('auth:sanctum')->get('/usuarios', fn () =>
        User::where('email','!=','nicoadmin@admin.com')
            ->get(['id','name','last_name','email','roles'])
    );

    Route::middleware('auth:sanctum')->post('/convertir-admin', function (Request $r) {
        $r->validate(['email'=>'required|email|exists:users,email']);
        User::where('email',$r->email)->update(['roles'=>'admin']);
        return response()->json(['message'=>'Usuario promovido a administrador']);
    });

    Route::middleware('auth:sanctum')->post('/quitar-admin', function (Request $r) {
        $r->validate(['email'=>'required|email|exists:users,email']);
        User::where('email',$r->email)->update(['roles'=>'normal']);
        return response()->json(['message'=>'Rol de administrador retirado']);
    });

   /* ------------------------------------------------------------
 *  ACTUALIZAR USUARIO  (imagen corregida)
 * ---------------------------------------------------------- */
Route::middleware('auth:sanctum')->post('/actualizar-usuario', [UsuarioController::class, 'update']);
Route::middleware('auth:sanctum')->get('/user', [UsuarioController::class, 'show']);




    /* ------------------------------------------------------------
     *  PEDIDOS
     * ---------------------------------------------------------- */
    Route::middleware('auth:sanctum')->post('/pedidos', [PedidoController::class,'store']);
    Route::middleware('auth:sanctum')->get('/pedidos-usuario/{correo}', [PedidoController::class,'pedidosUsuario']);

    /* ------------------------------------------------------------
     *  PASSWORD RESET
     * ---------------------------------------------------------- */
    Route::post('/forgot-password', function (Request $r) {
        $r->validate(['email'=>'required|email']);
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
            $r->only('email','password','password_confirmation','token'),
            fn ($u,$p) => $u->forceFill(['password'=>bcrypt($p)])->save()
        );

        return response()->json(['message' =>
            $status === Password::PASSWORD_RESET
                ? 'Contraseña cambiada correctamente.'
                : __($status)
        ]);
    });

    Route::get('/reset-password/{token}', function (Request $r,$token) {
        return redirect("http://localhost:5173/reset-password?token=$token&email=".$r->query('email'));
    });

    /* ------------------------------------------------------------
     *  PÁGINA DE INICIO
     * ---------------------------------------------------------- */
    Route::get('/', fn () => view('welcome'));

    /* ------------------------------------------------------------
     *  PRODUCTOS
     * ---------------------------------------------------------- */
    Route::middleware('auth:sanctum')->post('/agregar-producto', [ProductoController::class,'store']);

    Route::get('/categorias', fn () => Categoria::all(['id','nombre']));
    Route::get('/productos',  fn () => Producto::all());

    //  (edición segura – imagen no se pasa a fill)
    Route::middleware('auth:sanctum')->post('/editar-producto/{id}', function (Request $r,$id) {

        $producto = Producto::findOrFail($id);

        $validated = $r->validate([
            'nombre'       => 'required|string|max:255',
            'descripcion'  => 'required|string',
            'precio'       => 'required|numeric',
            'stock'        => 'required|integer',
            'id_categoria' => 'required|integer|exists:categorias,id',
            'img'          => 'nullable|image|max:2048',
        ]);

        // campos de texto
        $producto->fill( Arr::except($validated,['img']) );

        if ($r->hasFile('img')) {

            if ($producto->img && file_exists(public_path($producto->img))) {
                @unlink(public_path($producto->img));
            }

            $img      = $r->file('img');
            $fileName = time().'_'.$img->getClientOriginalName();

            $dir = public_path('uploads');
            if (!is_dir($dir)) mkdir($dir, 0755, true);

            $img->move($dir, $fileName);
            $producto->img = "uploads/$fileName";
        }

        $producto->save();

        return response()->json(['message'=>'Producto actualizado']);
    });

    Route::middleware('auth:sanctum')->delete('/eliminar-producto/{id}', function ($id) {
        $producto = Producto::find($id);
        if (!$producto) return response()->json(['message'=>'Producto no encontrado'],404);

        if ($producto->img && file_exists(public_path($producto->img))) {
            @unlink(public_path($producto->img));
        }
        $producto->delete();
        return response()->json(['message'=>'Producto eliminado correctamente']);
    });

    /* ------------------------------------------------------------
     *  STOCK Y ADMIN
     * ---------------------------------------------------------- */
    Route::middleware(['web','auth:sanctum'])->post('/renovar-stock', [StockController::class,'renovar']);
    Route::middleware('auth:sanctum')->get('/resumen-financiero', [AdminController::class,'resumenFinanciero']);

    /* ------------------------------------------------------------
     *  ELIMINAR CUENTA
     * ---------------------------------------------------------- */
    Route::middleware('auth:sanctum')->delete('/eliminar-usuario', function (Request $r) {
        $r->validate(['email'=>'required|email']);
        $user = User::where('email',$r->email)->first();
        if (!$user) return response()->json(['message'=>'Usuario no encontrado'],404);

        if ($user->profile_image &&
            $user->profile_image !== 'img/usuario/principal.png' &&
            file_exists(public_path($user->profile_image))) {
            @unlink(public_path($user->profile_image));
        }

        $user->delete();
        return response()->json(['message'=>'Cuenta eliminada correctamente.']);
    });



});
