<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;

class UsuarioController extends Controller
{
    /**
     * 🔹 **Registro de un nuevo usuario.**
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users',
            'password'   => 'required|string|confirmed|min:8',
            'address'    => 'required|string|max:255',
        ]);

        $user = User::create([
            'name'       => $validated['name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'],
            'password'   => bcrypt($validated['password']),
            'address'    => $validated['address'],
            'profile_image' => 'img/usuario/principal.png', // Imagen por defecto
        ]);

        return response()->json([
            'message' => 'Usuario registrado con éxito',
            'user'    => $user,
        ], 201);
    }

    /**
     * 🔹 **Actualizar perfil del usuario, incluida la foto de perfil.**
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'address'       => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        $user = $request->user();

        // 🔸 Actualizamos datos
        $user->name      = $validated['name'];
        $user->last_name = $validated['last_name'];
        $user->address   = $validated['address'] ?? $user->address;

        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');

            $filename = $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();

            $uploadPath = public_path('uploads');
            if (!File::exists($uploadPath)) {
                File::makeDirectory($uploadPath, 0755, true);
            }

            if ($user->profile_image && $user->profile_image !== 'img/usuario/principal.png') {
                $oldPath = public_path($user->profile_image);
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            $file->move($uploadPath, $filename);

            $user->profile_image = 'uploads/' . $filename;
        }

        $user->save();

        return response()->json([
            'message'       => 'Usuario actualizado correctamente',
            'profile_image' => asset($user->profile_image), // URL completa
            'user'          => $user
        ]);
    }

    /**
     * 🔹 **Obtener los datos del usuario autenticado.**
     */
    public function show(Request $request)
    {
        $user = $request->user();
        return response()->json($user, 200);
    }

    /**
     * 🔹 **Eliminar un usuario.**
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        if ($user->profile_image && $user->profile_image !== 'img/usuario/principal.png') {
            $imagePath = public_path($user->profile_image);
            if (File::exists($imagePath)) {
                File::delete($imagePath);
            }
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente.'], 200);
    }
}
