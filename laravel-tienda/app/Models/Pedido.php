<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Pedido
 * 
 * @property int $id
 * @property string $order_id
 * @property int $id_producto
 * @property int $user_id
 * @property string $correo
 * @property int $cantidad
 * @property float $precio
 * @property string $fecha
 *
 * @package App\Models
 */
class Pedido extends Model
{
    protected $table = 'pedidos';
    public $timestamps = false;

    protected $casts = [
        'id_producto' => 'int',
        'user_id' => 'int',
        'cantidad' => 'int',
        'precio' => 'float'
    ];

    protected $fillable = [
        'order_id',
        'id_producto',
        'user_id',
        'correo',
        'cantidad',
        'precio',
        'fecha'
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
