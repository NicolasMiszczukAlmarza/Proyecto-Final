<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class PedidoController extends Controller
{
    // ========================
    //      GUARDAR PEDIDO
    // ========================
    public function store(Request $request)
    {
        $data = $request->validate([
            'correo'     => 'required|email',
            'carrito'    => 'required|array',
            'total'      => 'required|numeric',
            'descuento'  => 'nullable|numeric'
        ]);

        $orderId = uniqid('order_', true);

        try {
            DB::beginTransaction();

            foreach ($data['carrito'] as $producto) {
                if (
                    !isset($producto['id']) ||
                    !isset($producto['cantidad']) ||
                    !isset($producto['precio'])
                ) {
                    DB::rollBack();
                    return response()->json(['message' => 'Datos del producto incompletos.'], 422);
                }

                // Verificar stock suficiente y bloquear la fila
                $productoDb = DB::table('productos')->where('id', $producto['id'])->lockForUpdate()->first();
                if (!$productoDb) {
                    DB::rollBack();
                    return response()->json(['message' => 'Producto no encontrado.'], 404);
                }
                if ($productoDb->stock < $producto['cantidad']) {
                    DB::rollBack();
                    return response()->json(['message' => 'Stock insuficiente para ' . $productoDb->nombre], 400);
                }

                // Insertar línea de pedido
                $precioProducto = $producto['cantidad'] * $producto['precio'];
                DB::table('pedidos')->insert([
                    'order_id'        => $orderId,
                    'id_producto'     => $producto['id'],
                    'correo'          => $data['correo'],
                    'cantidad'        => $producto['cantidad'],
                    'precio'          => $producto['precio'],
                    'precioProducto'  => $precioProducto,
                    'descuento'       => $data['descuento'] ?? 0,
                    'precioTotal'     => $data['total'],
                    'fecha'           => now(),
                ]);

                // Descontar stock
                DB::table('productos')
                    ->where('id', $producto['id'])
                    ->decrement('stock', $producto['cantidad']);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
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

    // ==============================================
    //      LISTAR TODOS LOS PEDIDOS DE UN USUARIO
    // ==============================================
    public function pedidosUsuario($correo)
    {
        try {
            $pedidos = DB::table('pedidos')
                ->join('productos', 'pedidos.id_producto', '=', 'productos.id')
                ->where('pedidos.correo', $correo)
                ->select(
                    'pedidos.*',
                    'productos.nombre as producto_nombre',
                    'productos.img as producto_img'
                )
                ->orderBy('pedidos.fecha', 'desc')
                ->get();

            return response()->json($pedidos, 200)
                ->withHeaders([
                    'Access-Control-Allow-Origin' => '*',
                    'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS, PUT, DELETE',
                    'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Authorization, Origin',
                    'Access-Control-Allow-Credentials' => 'true',
                ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los pedidos: ' . $e->getMessage()
            ], 500)
            ->withHeaders([
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS, PUT, DELETE',
                'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Authorization, Origin',
                'Access-Control-Allow-Credentials' => 'true',
            ]);
        }
    }
}
