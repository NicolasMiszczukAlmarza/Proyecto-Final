<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class UpdateUserImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Arregla rutas temporales en Windows y actualiza profile_image
     * moviendo archivos existentes en 'public/uploads' a la carpeta correcta
     * y guardando la ruta relativa en la base de datos.
     *
     * @return void
     */
    public function run(): void
    {
        // 1️⃣ Corregir rutas temporales de Windows
        DB::table('users')
            ->where('profile_image', 'LIKE', 'C:%')
            ->update(['profile_image' => 'img/usuario/principal.png']);

        $this->command->info('✅ Rutas temporales corregidas.');

        // 2️⃣ Asegurar existencia de directorio 'public/uploads'
        $uploadDir = public_path('uploads');
        if (! File::isDirectory($uploadDir)) {
            File::makeDirectory($uploadDir, 0755, true);
            $this->command->info("✅ Directorio 'uploads/' creado.");
        }

        // 3️⃣ Leer todos los archivos en 'uploads/' y actualizar BD
        $files = File::files($uploadDir);
        foreach ($files as $file) {
            $filename = $file->getFilename();
            // Esperamos nombres con formato {id}_{timestamp}.{ext}
            [$idPart] = explode('_', $filename);

            if (! is_numeric($idPart)) {
                $this->command->warn("⚠️ Archivo '$filename' omitido: ID no numérico.");
                continue;
            }
            $userId = (int) $idPart;

            $user = DB::table('users')->where('id', $userId)->first();
            if (! $user) {
                $this->command->warn("⚠️ No existe usuario con ID $userId para '$filename'.");
                continue;
            }

            // Construir ruta relativa
            $relativePath = 'uploads/' . $filename;

            // Actualizar solo si ha cambiado
            if ($user->profile_image !== $relativePath) {
                DB::table('users')
                    ->where('id', $userId)
                    ->update(['profile_image' => $relativePath]);

                $this->command->info("✅ Usuario ID $userId ({$user->email}) -> profile_image set to '$relativePath'.");
            }
        }

        $this->command->info('🌱 Seeder UpdateUserImagesSeeder completado.');
    }
}
