<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enfant_id')->constrained('enfants')->cascadeOnDelete();
            $table->unsignedTinyInteger('mois'); // 1–12
            $table->unsignedSmallInteger('annee');
            $table->decimal('montant_du', 8, 2);
            $table->enum('statut', ['en_attente', 'partiellement_regle', 'regle'])->default('en_attente');
            $table->string('pdf_chemin')->nullable();
            $table->timestamps();

            $table->unique(['enfant_id', 'mois', 'annee']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};
