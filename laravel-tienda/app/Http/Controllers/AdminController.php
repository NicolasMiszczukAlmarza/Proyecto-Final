<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function resumenFinanciero()
    {
        // 1) TOTAL de todos los pedidos
        $total = DB::table('pedidos')->sum('precioTotal');

        /* -----------------------------------------------------------
         * 2) BENEFICIOS
         *    - Excluimos pedidos de admins  (users.roles = 'admin')
         *    - Excluimos líneas internas de stock  (order_id like 'admin_stock%')
         *    - Sumamos cada order_id solo una vez
         * --------------------------------------------------------- */
        $beneficios = DB::table('pedidos as p')
            ->leftJoin('users as u', 'u.email', '=', 'p.correo')
            ->whereRaw("p.order_id NOT LIKE 'admin_stock%'")
            ->where(function ($q) {
                // usuarios sin rol admin o sin usuario asociado (por si se borró el user)
                $q->whereNull('u.roles')
                  ->orWhere('u.roles', '!=', 'admin');
            })
            ->select('p.order_id', DB::raw('SUM(p.precioTotal) as total'))
            ->groupBy('p.order_id')
            ->pluck('total')          // obtenemos solo los subtotales únicos
            ->sum();                  // y los sumamos

        /* -----------------------------------------------------------
         * 3) PÉRDIDAS
         *    - Cualquier pedido cuyo correo sea de un user con rol admin
         * --------------------------------------------------------- */
        $perdidas = DB::table('pedidos as p')
            ->join('users as u', 'u.email', '=', 'p.correo')
            ->where('u.roles', 'admin')
            ->sum('p.precioTotal');

        return response()->json([
            'total'      => round($total, 2),
            'beneficios' => round($beneficios, 2),
            'perdidas'   => round($perdidas, 2),
        ]);
    }
}
