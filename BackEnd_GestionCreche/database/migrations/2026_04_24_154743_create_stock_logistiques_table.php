<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_logistiques', function (Blueprint $table) {
            $table->id();
            $table->string('produit'); // ex: Couches, Lait, Lingettes
            $table->decimal('quantite_actuelle', 10, 2)->default(0);
            $table->string('unite'); // ex: kg, litres, unités, boites
            $table->decimal('seuil_alerte', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_logistiques');
    }
};
