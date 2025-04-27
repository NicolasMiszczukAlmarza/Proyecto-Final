<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\PedidoController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// 📌 Middleware 'web' para sesiones y cookies
Route::middleware(['web'])->group(function () {

    // 📌 CSRF Token para uso con Sanctum
    Route::get('sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('csrf-cookie');

    // 📌 Login de usuario
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
    })->name('login');

    // 📌 Cierre de sesión
    Route::post('/logout', function () {
        Auth::logout();
        return response()->json(['message' => 'Logout exitoso']);
    })->name('logout');

    // 📌 Obtener datos del usuario autenticado (ruta '/user')
    Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
        // Esta ruta usa el middleware 'auth:sanctum' para asegurar que el usuario esté autenticado
        return response()->json($request->user()); // Devuelve los datos del usuario autenticado
    })->name('user');

    // 📌 Obtener datos del usuario autenticado (ruta '/users') - alternativa
    Route::middleware(['auth:sanctum'])->get('/users', function (Request $request) {
        // Ahora la ruta '/users' devuelve los datos del usuario autenticado
        return response()->json($request->user()); // Devuelve los datos del usuario autenticado
    })->name('users');

    // 📌 Registro
    Route::get('/register', fn () => view('auth.register'))->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

    // 📌 Página principal
    Route::get('/', fn () => view('welcome'));

    // 📌 Proteger GET en /login
    Route::get('/login', fn () => response()->json(['message' => 'Esta ruta solo acepta POST'], 405));

    // 📌 Guardar pedido
    Route::post('/pedidos', [PedidoController::class, 'store'])->middleware('auth:sanctum');

    // 📌 Actualizar datos del usuario autenticado
    Route::post('/actualizar-usuario', function (Request $request) {
        $user = Auth::user();
    
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|max:2048',
        ]);
    
        if ($request->hasFile('profile_image')) {
            // Elimina la imagen anterior solo si no es la default y existe
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
    
            // Guarda el path relativo
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
    

    

    
});
