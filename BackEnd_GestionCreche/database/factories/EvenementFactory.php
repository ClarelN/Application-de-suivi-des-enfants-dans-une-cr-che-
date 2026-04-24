<?php
// database/factories/EvenementFactory.php

namespace Database\Factories;

use App\Models\Evenement;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvenementFactory extends Factory
{
    protected $model = Evenement::class;

    public function definition(): array
    {
        $dateDebut = fake()->dateTimeBetween('-60 days', '+60 days');
        $dateFin = (clone $dateDebut)->modify('+2 days');

        return [
            'titre' => fake()->sentence(),
            'description' => fake()->optional(0.7)->paragraph(3),
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'places_max' => fake()->optional(0.8)->numberBetween(20, 100),
        ];
    }

    public function sortie(): static
    {
        return $this->state(fn (array $attributes) => [
            'titre' => 'Sortie pédagogique ' . fake()->words(2, true),
            'description' => 'Une sortie éducative pour les enfants',
        ]);
    }

    public function fete(): static
    {
        return $this->state(fn (array $attributes) => [
            'titre' => 'Fête ' . fake()->words(2, true),
            'description' => 'Une fête à la crèche',
        ]);
    }

    public function reunion(): static
    {
        return $this->state(fn (array $attributes) => [
            'titre' => 'Réunion parents',
            'description' => 'Réunion avec les parents pour bilan trimestriel',
        ]);
    }
}
