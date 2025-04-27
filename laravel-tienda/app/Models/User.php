<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Class User
 * 
 * @property int $id
 * @property string $name
 * @property string $last_name
 * @property string $email
 * @property string $password
 * @property string $address
 * @property string $roles
 * @property string $profile_image    // <-- Agregado aquí
 * @property string $remember_token
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class User extends Authenticatable
{
    protected $table = 'users';

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'address',
        'roles',
        'profile_image',      // <-- AÑADE ESTE CAMPO
        'remember_token'
    ];

    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'user_id');
    }
}
