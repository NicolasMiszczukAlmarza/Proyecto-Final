<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UpdateUserDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 🔄 Actualizar los datos del usuario
        $user = User::where('email', 'nicobueno@nico.com')->first();

        if ($user) {
            $user->name = 'Nico';
            $user->last_name = 'Bueno';
            $user->address = 'Dirección actualizada';
            $user->profile_image = 'uploads/1746641034_Doraemon.png';



            $user->save();

            $this->command->info('✅ Usuario actualizado correctamente.');
        } else {
            $this->command->error('⚠️ Usuario no encontrado.');
        }
    }
}
