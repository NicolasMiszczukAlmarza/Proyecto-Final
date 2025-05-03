<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Producto
 *
 * @property int $id
 * @property string $nombre
 * @property int $stock
 * @property float $precio
 * @property int $id_categoria
 * @property string $descripcion
 * @property string $img
 *
 * @property Categoria $categoria
 * @property Pedido[] $pedidos
 *
 * @package App\Models
 */
class Producto extends Model
{
    protected $table = 'productos';
    public $timestamps = false;

    protected $casts = [
        'stock' => 'int',
        'precio' => 'float',
        'id_categoria' => 'int',
    ];

    protected $fillable = [
        'nombre',
        'stock',
        'precio',
        'id_categoria',
        'descripcion',
        'img',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'id_categoria');
    }

    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class, 'id_producto');
    }
}
