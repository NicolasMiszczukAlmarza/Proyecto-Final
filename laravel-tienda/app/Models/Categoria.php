<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Categoria
 * 
 * @property int $id
 * @property string $nombre
 * @property string $img
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class Categoria extends Model
{
    protected $table = 'categorias';

    protected $fillable = [
        'nombre',
        'img'
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id_categoria');
    }
}
