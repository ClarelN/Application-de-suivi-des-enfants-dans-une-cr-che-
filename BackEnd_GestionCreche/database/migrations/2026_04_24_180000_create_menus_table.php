<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->enum('type_repas', ['matin', 'dejeuner', 'gouter'])->default('dejeuner');
            $table->string('plat_principal')->nullable();
            $table->string('accompagnement')->nullable();
            $table->string('dessert')->nullable();
            $table->text('allergenes')->nullable();
            $table->timestamps();

            $table->unique(['date', 'type_repas']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
