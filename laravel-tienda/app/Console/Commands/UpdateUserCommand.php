<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UpdateUserCommand extends Command
{
    protected $signature = 'user:update {email} {name?} {last_name?} {address?} {image?}';
    protected $description = 'Actualiza los datos de un usuario especificado';

    public function handle()
    {
        $email = $this->argument('email');
        $name = $this->argument('name');
        $lastName = $this->argument('last_name');
        $address = $this->argument('address');
        $image = $this->argument('image');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error('Usuario no encontrado.');
            return;
        }

        if ($image) {
            $path = 'uploads/' . time() . '_' . $image->getClientOriginalName();
            Storage::put($path, file_get_contents($image));
            $user->profile_image = $path;
        }

        $user->update([
            'name' => $name ?? $user->name,
            'last_name' => $lastName ?? $user->last_name,
            'address' => $address ?? $user->address,
        ]);

        $this->info('Usuario actualizado correctamente.');
    }
}
