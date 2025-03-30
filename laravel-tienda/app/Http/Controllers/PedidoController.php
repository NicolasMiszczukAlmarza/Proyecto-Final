<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class PedidoController extends Controller
{
    public function store(Request $request)
    {
        // Validar datos recibidos
        $data = $request->validate([
            'correo'  => 'required|email',
            'carrito' => 'required|array',
            'total'   => 'required|numeric'
        ]);

        // Generar un identificador único para agrupar todos los productos de este pedido.
        // Usamos uniqid; alternativamente podrías usar un UUID.
        $orderId = uniqid('order_', true);

        try {
            // Insertamos cada producto del carrito, asignándole el mismo order_id.
            foreach ($data['carrito'] as $producto) {
                DB::table('pedidos')->insert([
                    // Asumiendo que has agregado una columna "order_id" a la tabla pedidos.
                    'order_id'    => $orderId,
                    'id_producto' => $producto['id'],
                    'correo'      => $data['correo'],
                    'cantidad'    => $producto['cantidad'] ?? 1,
                    'precio'      => $producto['precio'] ?? 0,
                    // 'fecha' se asignará automáticamente usando CURRENT_TIMESTAMP (según la definición de la columna)
                ]);
            }
        } catch (Exception $e) {
            return response()->json(['message' => 'Error al registrar el pedido: ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Pedido registrado exitosamente', 'order_id' => $orderId], 201);
    }
}
