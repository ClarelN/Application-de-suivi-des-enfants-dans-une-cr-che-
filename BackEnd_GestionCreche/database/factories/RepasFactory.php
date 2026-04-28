<?php

namespace Database\Factories;

use App\Models\Repas;
use Illuminate\Database\Eloquent\Factories\Factory;

class RepasFactory extends Factory
{
    protected $model = Repas::class;

    public function definition(): array
    {
        $noms = ['Déjeuner', 'Goûter', 'Petit-déjeuner', 'Dîner'];
        $start = fake()->dateTimeBetween('-30 days', 'now');

        return [
            'nom_repas'   => fake()->randomElement($noms),
            'description' => fake()->optional(0.7)->sentence(6),
            'date'        => $start->format('Y-m-d'),
            'heure'       => $start->format('H:i'),
        ];
    }
}
