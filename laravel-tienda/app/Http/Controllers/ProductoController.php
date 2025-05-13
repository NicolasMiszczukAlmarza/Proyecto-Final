<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Models\Producto;

class ProductoController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre'        => 'required|string|max:255',
                'stock'         => 'nullable|integer|min:0',
                'precio'        => 'required|numeric|min:0',
                'id_categoria'  => 'required|exists:categorias,id',
                'descripcion'   => 'nullable|string',
                'img'           => 'nullable|image|max:2048',
            ]);

            $validated['stock'] = $validated['stock'] ?? 50;

            if ($request->hasFile('img')) {
                $image = $request->file('img');
                $filename = time() . '_' . $image->getClientOriginalName();
                $image->move(public_path('uploads/productos'), $filename);
                $validated['img'] = 'uploads/productos/' . $filename;
            } else {
                $validated['img'] = 'img/producto/default.png';
            }

            $producto = Producto::create($validated);

            return response()->json([
                'message' => 'Producto agregado correctamente',
                'producto' => $producto,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $producto = Producto::findOrFail($id);

            $validated = $request->validate([
                'nombre'        => 'required|string|max:255',
                'stock'         => 'required|integer|min:0',
                'precio'        => 'required|numeric|min:0',
                'id_categoria'  => 'required|exists:categorias,id',
                'descripcion'   => 'nullable|string',
                'img'           => 'nullable|image|max:2048',
            ]);

            if ($request->hasFile('img')) {
                if (
                    $producto->img &&
                    $producto->img !== 'img/producto/default.png' &&
                    File::exists(public_path($producto->img))
                ) {
                    File::delete(public_path($producto->img));
                }

                $image = $request->file('img');
                $filename = time() . '_' . $image->getClientOriginalName();
                $image->move(public_path('uploads/productos'), $filename);
                $validated['img'] = 'uploads/productos/' . $filename;
            }

            $producto->update($validated);

            return response()->json(['message' => 'Producto actualizado correctamente']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el producto',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $producto = Producto::findOrFail($id);

            if (
                $producto->img &&
                $producto->img !== 'img/producto/default.png' &&
                File::exists(public_path($producto->img))
            ) {
                File::delete(public_path($producto->img));
            }

            $producto->delete();

            return response()->json(['message' => 'Producto eliminado correctamente']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el producto',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
