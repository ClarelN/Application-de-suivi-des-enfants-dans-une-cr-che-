<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consommation_repas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enfant_id')
                  ->constrained('enfants')
                  ->cascadeOnDelete();
            $table->foreignId('repas_id')
                  ->constrained('repas')
                  ->cascadeOnDelete();
            $table->enum('quantite_mangee', [
                'tout',
                'un_peu',
                'rien'
            ])->default('tout');
            $table->text('commentaires')->nullable();
            $table->timestamps();

            // Un enfant ne peut pas avoir 2 entrées pour le même repas
            $table->unique(['enfant_id', 'repas_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consommation_repas');
    }
};
