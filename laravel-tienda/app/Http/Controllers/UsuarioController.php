<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class UsuarioController extends Controller
{
    /**
     * Devuelve el usuario autenticado.
     */
    public function show(Request $request)
    {
        $user = $request->user();
    
        // Corrige rutas relativas
        if ($user->profile_image &&
            !str_starts_with($user->profile_image, 'http')) {
            $user->profile_image = asset($user->profile_image);
        }
    
        // Mantén la lógica que ya tenías
        if (str_starts_with($user->profile_image ?? '', 'C:') ||
            str_starts_with($user->profile_image ?? '', 'file://')) {
            $user->profile_image = 'img/usuario/principal.png';
        }
    
        return response()->json($user);
    }
    

    /**
     * Actualiza datos personales y la imagen de perfil.
     * POST /user/actualizar  o  /actualizar-usuario
     */
    public function update(Request $request)
    {
        // ⚠️ Si se usa en ruta pública, mejor asegurar el usuario manualmente
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        // Validación de los campos
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'address'       => 'nullable|string|max:255',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        // Campos de texto
        $user->fill(Arr::except($data, ['profile_image']));

        // Procesar imagen si existe
        if ($request->hasFile('profile_image')) {

            // Borrar imagen anterior si es personalizada
            if ($user->profile_image &&
                $user->profile_image !== 'img/usuario/principal.png' &&
                file_exists(public_path($user->profile_image))) {
                @unlink(public_path($user->profile_image));
            }

            $file     = $request->file('profile_image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $dest     = public_path('uploads');

            if (!is_dir($dest)) {
                mkdir($dest, 0755, true);
            }

            $file->move($dest, $fileName);

            // Guardar ruta relativa (no absoluta)
            $user->profile_image = "uploads/$fileName";
        }

        $user->save();

        return response()->json([
            'message'       => 'Perfil actualizado correctamente.',
            'profile_image' => asset($user->profile_image), // URL completa para el frontend
            'user'          => $user,
        ]);
    }
}
