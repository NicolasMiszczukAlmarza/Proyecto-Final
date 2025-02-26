<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function store(Request $request) // Método para registrar el usuario
    {
        // Validación de los datos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:8', // confirmed as default
            'address' => 'required|string|max:255',
        ]);

        // Crear el usuario en la base de datos con el rol "normal" por defecto
        $user = User::create([
            'name' => $validated['name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']), // Hash para la contraseña
            'address' => $validated['address'],
            'roles' => 'normal', // Rol asignado automáticamente
        ]);

        // Retornar una respuesta con el usuario creado
        return response()->json([
            'message' => 'Usuario registrado con éxito',
            'user' => $user
        ], 201);
    }
}
