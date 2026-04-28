<?php

namespace Database\Factories;

use App\Models\StockLogistique;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockLogistiqueFactory extends Factory
{
    protected $model = StockLogistique::class;

    public function definition(): array
    {
        $produits = [
            ['nom' => 'Couches',    'unite' => 'unités'],
            ['nom' => 'Lait',       'unite' => 'litres'],
            ['nom' => 'Lingettes',  'unite' => 'paquets'],
            ['nom' => 'Savon',      'unite' => 'flacons'],
            ['nom' => 'Céréales',   'unite' => 'kg'],
        ];
        $produit = fake()->randomElement($produits);

        return [
            'produit'           => $produit['nom'],
            'quantite_actuelle' => fake()->randomFloat(2, 0, 100),
            'unite'             => $produit['unite'],
            'seuil_alerte'      => fake()->randomFloat(2, 5, 20),
        ];
    }

    public function enAlerte(): static
    {
        return $this->state(fn(array $attributes) => [
            'quantite_actuelle' => 0,
            'seuil_alerte'      => 10,
        ]);
    }
}
