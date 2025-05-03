<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    public function run()
    {
        $categorias = [
            ['nombre' => 'Placa base', 'img' => '/img/icono/placa.PNG'],
            ['nombre' => 'Procesadores', 'img' => '/img/icono/AMD Ryzen 5 5600X.PNG'],
            ['nombre' => 'RAM', 'img' => '/img/icono/Acer vesta DDR5 6000.JPG'],
            ['nombre' => 'Tarjetas graficas', 'img' => '/img/icono/AMD Radeon RX 6600 XT.PNG'],
            ['nombre' => 'Torres', 'img' => '/img/icono/Antec DF700 Flux.PNG'],
            ['nombre' => 'Fuente de alimentacion', 'img' => '/img/icono/be quiet! Straight Power 11 750W.PNG'],
            ['nombre' => 'Sobremesa', 'img' => '/img/icono/Acer Aspire TC-895-UA91.PNG'],
            ['nombre' => 'Portatiles', 'img' => '/img/icono/Acer Aspire 5.PNG'],
            ['nombre' => 'SSD', 'img' => '/img/icono/ssd.PNG'],
            ['nombre' => 'Discos duros HDD', 'img' => '/img/icono/hdd.PNG'],
        ];

        foreach ($categorias as $cat) {
            Categoria::create($cat);
        }
    }
}
