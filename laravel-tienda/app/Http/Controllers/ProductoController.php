<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'stock' => 'nullable|integer|min:0',
            'precio' => 'required|numeric|min:0',
            'id_categoria' => 'required|exists:categorias,id',
            'descripcion' => 'nullable|string',
            'img' => 'nullable|image|max:2048',
        ]);

        // Asignar stock por defecto si no se proporciona
        $validated['stock'] = $validated['stock'] ?? 50;

        // Procesar imagen
        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/productos'), $imageName);
            $validated['img'] = 'uploads/productos/' . $imageName;
        } else {
            $validated['img'] = 'img/producto/default.png'; // Imagen por defecto
        }

        $producto = Producto::create($validated);

        return response()->json([
            'message' => 'Producto agregado correctamente',
            'producto' => $producto,
        ], 201);
    }
}
