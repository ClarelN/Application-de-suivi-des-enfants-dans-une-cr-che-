<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->string('fichier_chemin')->nullable()->after('corps');
            $table->string('fichier_type')->nullable()->after('fichier_chemin');
            $table->string('fichier_nom')->nullable()->after('fichier_type');
            $table->unsignedBigInteger('fichier_taille')->nullable()->after('fichier_nom');
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['fichier_chemin', 'fichier_type', 'fichier_nom', 'fichier_taille']);
        });
    }
};
