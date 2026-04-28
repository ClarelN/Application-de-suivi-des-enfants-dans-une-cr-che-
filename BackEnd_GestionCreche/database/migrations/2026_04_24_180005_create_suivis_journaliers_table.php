<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suivis_journaliers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enfant_id')->constrained('enfants')->cascadeOnDelete();
            $table->foreignId('educateur_id')->constrained('utilisateurs')->cascadeOnDelete();
            $table->date('date');
            $table->enum('repas', ['tout', 'un_peu', 'rien'])->nullable();
            $table->time('sieste_debut')->nullable();
            $table->time('sieste_fin')->nullable();
            $table->unsignedTinyInteger('humeur')->nullable(); // 1 (mauvaise) à 5 (excellente)
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['enfant_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suivis_journaliers');
    }
};
