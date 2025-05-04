<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Pedido;
use Illuminate\Support\Facades\Auth;

class StockController extends Controller
{
    public function renovar(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
            'order_id' => 'nullable|string',
        ]);

        $producto = Producto::findOrFail($validated['id']);
        $producto->stock += $validated['cantidad'];
        $producto->save();

        Pedido::create([
            'order_id' => $validated['order_id'] ?? 'admin_stock_' . uniqid(),
            'id_producto' => $producto->id,
            'user_id' => Auth::id(),
            'correo' => Auth::user()->email,
            'cantidad' => $validated['cantidad'],
            'precio' => $producto->precio,
            'precioProducto' => $producto->precio * $validated['cantidad'],
            'descuento' => 0,
            'precioTotal' => $producto->precio * $validated['cantidad'],
            'fecha' => now(),
        ]);

        return response()->json(['message' => 'Stock actualizado correctamente']);
    }
}
