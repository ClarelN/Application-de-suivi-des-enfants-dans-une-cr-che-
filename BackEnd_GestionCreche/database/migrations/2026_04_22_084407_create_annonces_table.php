<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('annonces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('utilisateurs')->cascadeOnDelete();
            $table->string('titre');
            $table->text('corps');
            $table->enum('cible', ['tous', 'parents', 'educateurs'])->default('tous');
            $table->dateTime('expire_le')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('annonces');
    }
};
