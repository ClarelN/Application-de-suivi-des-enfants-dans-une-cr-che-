<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enfant_id')->constrained('enfants')->cascadeOnDelete();
            $table->foreignId('educateur_id')->constrained('utilisateurs')->cascadeOnDelete();
            $table->date('date');
            $table->string('type'); // ex: chute, maladie, conflit
            $table->text('description');
            $table->enum('gravite', ['faible', 'moyen', 'eleve'])->default('faible');
            $table->boolean('traite')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
