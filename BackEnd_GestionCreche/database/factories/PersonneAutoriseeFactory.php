<?php
// database/factories/PersonneAutoriseeFactory.php

namespace Database\Factories;

use App\Models\PersonneAutorisee;
use App\Models\Enfant;
use Illuminate\Database\Eloquent\Factories\Factory;

class PersonneAutoriseeFactory extends Factory
{
    protected $model = PersonneAutorisee::class;

    protected $liens = [
        'Grand-mère',
        'Grand-père',
        'Oncle',
        'Tante',
        'Nourrice',
        'Autre parent',
        'Tuteur',
    ];

    public function definition(): array
    {
        return [
            'enfant_id' => Enfant::factory(),
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'lien_parente' => fake()->randomElement($this->liens),
            'telephone' => fake()->phoneNumber(),
        ];
    }

    public function grandmere(): static
    {
        return $this->state(fn (array $attributes) => [
            'lien_parente' => 'Grand-mère',
            'prenom' => fake()->firstName('female'),
        ]);
    }

    public function grandpere(): static
    {
        return $this->state(fn (array $attributes) => [
            'lien_parente' => 'Grand-père',
            'prenom' => fake()->firstName('male'),
        ]);
    }

    public function nourrice(): static
    {
        return $this->state(fn (array $attributes) => [
            'lien_parente' => 'Nourrice',
        ]);
    }
}
