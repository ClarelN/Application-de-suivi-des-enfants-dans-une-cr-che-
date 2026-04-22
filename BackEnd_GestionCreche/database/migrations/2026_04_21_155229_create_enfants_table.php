<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enfants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('groupe_id')->nullable()->constrained('groupes')->nullOnDelete();
            $table->string('nom');
            $table->string('prenom');
            $table->date('date_naissance');
            $table->enum('sexe', ['M', 'F']);
            $table->string('photo_chemin')->nullable();
            $table->text('allergie')->nullable();
            $table->text('obs_medicale')->nullable();
            $table->enum('statut', ['actif', 'inactif', 'archive'])->default('actif');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enfants');
    }
};
