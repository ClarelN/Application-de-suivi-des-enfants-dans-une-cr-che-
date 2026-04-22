<?php
// database/factories/GroupeFactory.php

namespace Database\Factories;

use App\Models\Groupe;
use Illuminate\Database\Eloquent\Factories\Factory;

class GroupeFactory extends Factory
{
    protected $model = Groupe::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->name(),
            'age_min_mois' => 2,
            'age_max_mois' => 12,
            'capacite_max' => 8,
            'couleur' => fake()->hexColor(),
        ];
    }

    public function poussins(): static
    {
        return $this->state(fn (array $attributes) => [
            'nom' => 'Poussins',
            'age_min_mois' => 2,
            'age_max_mois' => 12,
            'capacite_max' => 8,
            'couleur' => '#FFD700',
        ]);
    }

    public function papillons(): static
    {
        return $this->state(fn (array $attributes) => [
            'nom' => 'Papillons',
            'age_min_mois' => 12,
            'age_max_mois' => 24,
            'capacite_max' => 10,
            'couleur' => '#FF69B4',
        ]);
    }

    public function coccinelles(): static
    {
        return $this->state(fn (array $attributes) => [
            'nom' => 'Coccinelles',
            'age_min_mois' => 24,
            'age_max_mois' => 36,
            'capacite_max' => 12,
            'couleur' => '#FF0000',
        ]);
    }

    public function petits(): static
    {
        return $this->state(fn (array $attributes) => [
            'nom' => 'Petits',
            'age_min_mois' => 24,
            'age_max_mois' => 36,
            'capacite_max' => 12,
            'couleur' => '#FFA500',
        ]);
    }

    public function moyens(): static
    {
        return $this->state(fn (array $attributes) => [
            'nom' => 'Moyens',
            'age_min_mois' => 36,
            'age_max_mois' => 48,
            'capacite_max' => 14,
            'couleur' => '#00CED1',
        ]);
    }

    public function grands(): static
    {
        return $this->state(fn (array $attributes) => [
            'nom' => 'Grands',
            'age_min_mois' => 48,
            'age_max_mois' => 60,
            'capacite_max' => 16,
            'couleur' => '#4169E1',
        ]);
    }
}
