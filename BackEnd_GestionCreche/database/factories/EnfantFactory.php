<?php
// database/factories/EnfantFactory.php

namespace Database\Factories;

use App\Models\Enfant;
use App\Models\Groupe;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class EnfantFactory extends Factory
{
    protected $model = Enfant::class;

    public function definition(): array
    {
        return [
            'groupe_id' => Groupe::factory(),
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'date_naissance' => fake()->dateTimeBetween('-5 years', '-2 years'),
            'sexe' => fake()->randomElement(['M', 'F']),
            'photo_chemin' => null,
            'allergie' => fake()->boolean(20) ? fake()->sentence(3) : null,
            'obs_medicale' => fake()->boolean(15) ? fake()->sentence(4) : null,
            'statut' => 'actif',
        ];
    }

    public function actif(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'actif',
        ]);
    }

    public function inactif(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'inactif',
        ]);
    }

    public function archive(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'archive',
        ]);
    }

    public function avecAllergie(): static
    {
        return $this->state(fn (array $attributes) => [
            'allergie' => fake()->sentence(3),
        ]);
    }

    public function avecObservationMedicale(): static
    {
        return $this->state(fn (array $attributes) => [
            'obs_medicale' => fake()->sentence(4),
        ]);
    }
}
