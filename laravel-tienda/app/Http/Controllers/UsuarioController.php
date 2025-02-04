<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    // Mostrar formulario (si es necesario)
    public function showForm()
    {
        return view('auth.register'); // Esto es solo si usas una vista para el formulario, si usas React no es necesario
    }

    // Procesar formulario de registro
    public function store(Request $request)
    {
        // Validación de los datos del formulario
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Crear el usuario
        $user = User::create([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'address' => $request->address,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Encriptar la contraseña
        ]);

        // Responder con éxito
        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user
        ], 201);
    }
}
