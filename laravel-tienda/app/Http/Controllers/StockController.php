<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Producto;

class StockController extends Controller
{
    public function renovar(Request $request)
    {
        $validated = $request->validate([
            'id'       => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
        ]);

        // ─── 1) Actualizar stock del producto ──────────────────────────────
        $producto            = Producto::findOrFail($validated['id']);
        $producto->stock    += $validated['cantidad'];
        $producto->save();

        // ─── 2) Registrar la “compra” interna como pedido de admin ─────────
        $admin      = Auth::user();                      // el admin conectado
        $orderId    = 'admin_stock_' . uniqid();         // id único
        $precioUnit = $producto->precio;                 // coste = PVP; cámbialo si usas otro campo
        $totalLine  = $precioUnit * $validated['cantidad'];

        DB::table('pedidos')->insert([
            'order_id'       => $orderId,
            'id_producto'    => $producto->id,
            'user_id'        => $admin->id,
            'correo'         => $admin->email,
            'cantidad'       => $validated['cantidad'],
            'precio'         => $precioUnit,
            'precioProducto' => $totalLine,
            'descuento'      => 0,
            'precioTotal'    => $totalLine,
            'fecha'          => now(),
        ]);

        return response()->json([
            'message' => 'Stock renovado y movimiento registrado',
            'nuevoStock' => $producto->stock,
        ]);
    }
}
