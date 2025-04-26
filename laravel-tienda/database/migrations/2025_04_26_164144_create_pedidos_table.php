<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->string('order_id');
            $table->unsignedBigInteger('id_producto');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('correo');
            $table->integer('cantidad');
            $table->float('precio');
            $table->float('precioProducto')->nullable();
            $table->float('descuento')->nullable();
            $table->float('precioTotal')->nullable();
            $table->timestamp('fecha')->useCurrent();

            // Relaciones
            $table->foreign('id_producto')->references('id')->on('productos')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pedidos');
    }
};
