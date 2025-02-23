<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id(); // ID autoincremental
            $table->string('nombre'); // Nombre de la categoría
            $table->string('img'); // Ruta de la imagen
            $table->timestamps(); // created_at y updated_at
        });
    }

    public function down() {
        Schema::dropIfExists('categorias');
    }
};
