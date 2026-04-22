<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('educateur_groupe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('educateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('groupe_id')->constrained('groupes')->onDelete('cascade');
            $table->date('date_affectation')->nullable();
            $table->boolean('principal')->default(false);
            $table->unique(['educateur_id', 'groupe_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educateur_groupe');
    }
};
