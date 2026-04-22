<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_enfant', function (Blueprint $table) {
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->foreignId('enfant_id')->constrained('enfants')->cascadeOnDelete();
            $table->primary(['activity_id', 'enfant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_enfant');
    }
};
