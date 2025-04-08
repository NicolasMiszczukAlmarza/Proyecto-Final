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
            'total'   => 'required|numeric',
            'descuento' => 'nullable|numeric'  // Acepta el descuento como numérico
        ]);

        // Generar un identificador único para el pedido
        $orderId = uniqid('order_', true);

        try {
            // Insertar cada producto del carrito
            foreach ($data['carrito'] as $producto) {
                if (!isset($producto['id']) || !isset($producto['cantidad']) || !isset($producto['precio'])) {
                    return response()->json(['message' => 'Datos del producto incompletos.'], 422);
                }

                // Calcular el precio total por el número de unidades
                $precioProducto = $producto['cantidad'] * $producto['precio'];

                DB::table('pedidos')->insert([
                    'order_id'       => $orderId,
                    'id_producto'    => $producto['id'],
                    'correo'         => $data['correo'],
                    'cantidad'       => $producto['cantidad'],
                    'precioProducto' => $precioProducto,
                    'descuento'      => $data['descuento'] ?? 0,   // Guarda el descuento o 0 si no existe
                    'precioTotal'    => $data['total'],
                    'fecha'          => now(),
                ]);
            }
        } catch (Exception $e) {
            return response()->json(['message' => 'Error al registrar el pedido: ' . $e->getMessage()], 500)
                ->withHeaders([
                    'Access-Control-Allow-Origin' => '*',
                    'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
                    'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Authorization, Origin',
                    'Access-Control-Allow-Credentials' => 'true',
                ]);
        }

        return response()->json(['message' => 'Pedido registrado exitosamente', 'order_id' => $orderId], 201)
            ->withHeaders([
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Authorization, Origin',
                'Access-Control-Allow-Credentials' => 'true',
            ]);
    }
}
