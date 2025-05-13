<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AdminController extends Controller
{
    public function resumenFinanciero()
    {
        $total = DB::table('pedidos')->sum('precioTotal');

        $beneficios = DB::table('pedidos as p')
            ->leftJoin('users as u', 'u.email', '=', 'p.correo')
            ->whereRaw("p.order_id NOT LIKE 'admin_stock%'")
            ->where(function ($q) {
                $q->whereNull('u.roles')->orWhere('u.roles', '!=', 'admin');
            })
            ->select('p.order_id', DB::raw('SUM(p.precioTotal) as total'))
            ->groupBy('p.order_id')
            ->pluck('total')
            ->sum();

        $perdidas = DB::table('pedidos as p')
            ->join('users as u', 'u.email', '=', 'p.correo')
            ->where('u.roles', 'admin')
            ->sum('p.precioTotal');

        return response()->json([
            'total' => round($total, 2),
            'beneficios' => round($beneficios, 2),
            'perdidas' => round($perdidas, 2),
        ]);
    }

    public function convertirAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->firstOrFail();
        $user->roles = 'admin';
        $user->save();

        return response()->json(['message' => 'Usuario promovido a administrador.']);
    }

    public function quitarAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->firstOrFail();
        $user->roles = 'normal';
        $user->save();

        return response()->json(['message' => 'Rol de administrador retirado.']);
    }

    public function eliminarUsuario(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->firstOrFail();
        $authUser = Auth::user();

        if ($authUser && $authUser->email === $user->email) {
            return response()->json(['message' => 'No puedes eliminar tu propia cuenta.'], 403);
        }

        // Eliminar imagen si es personalizada
        if ($user->profile_image &&
            $user->profile_image !== 'img/usuario/principal.png' &&
            file_exists(public_path($user->profile_image))
        ) {
            @unlink(public_path($user->profile_image));
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }
}
