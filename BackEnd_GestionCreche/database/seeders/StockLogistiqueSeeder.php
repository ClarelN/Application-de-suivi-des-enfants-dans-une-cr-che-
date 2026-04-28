<?php

namespace Database\Seeders;

use App\Models\StockLogistique;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StockLogistiqueSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $stocks = [
            ['produit' => 'Couches (taille 1)',  'quantite_actuelle' => 120, 'unite' => 'unités',  'seuil_alerte' => 30],
            ['produit' => 'Couches (taille 2)',  'quantite_actuelle' => 80,  'unite' => 'unités',  'seuil_alerte' => 30],
            ['produit' => 'Lait maternisé',      'quantite_actuelle' => 15,  'unite' => 'litres',  'seuil_alerte' => 10],
            ['produit' => 'Lingettes humides',   'quantite_actuelle' => 4,   'unite' => 'paquets', 'seuil_alerte' => 10],
            ['produit' => 'Savon liquide',       'quantite_actuelle' => 6,   'unite' => 'flacons', 'seuil_alerte' => 3],
            ['produit' => 'Céréales bébé',       'quantite_actuelle' => 3.5, 'unite' => 'kg',      'seuil_alerte' => 2],
            ['produit' => 'Compotes (poches)',   'quantite_actuelle' => 50,  'unite' => 'unités',  'seuil_alerte' => 20],
            ['produit' => 'Gel désinfectant',    'quantite_actuelle' => 2,   'unite' => 'flacons', 'seuil_alerte' => 5],
        ];

        foreach ($stocks as $stock) {
            StockLogistique::firstOrCreate(
                ['produit' => $stock['produit']],
                $stock
            );
        }
    }
}
