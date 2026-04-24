<?php
// database/factories/AnnonceFactory.php

namespace Database\Factories;

use App\Models\Annonce;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class AnnonceFactory extends Factory
{
    protected $model = Annonce::class;

    public function definition(): array
    {
        // Récupérer un utilisateur au hasard
        $userId = DB::table('utilisateurs')->inRandomOrder()->first()?->id ?? 1;

        return [
            'user_id' => $userId,
            'titre' => fake()->sentence(),
            'corps' => fake()->paragraph(4),
            'cible' => fake()->randomElement(['tous', 'parents', 'educateurs']),
            'expire_le' => fake()->optional(0.7)->dateTimeBetween('+1 days', '+90 days'),
        ];
    }

    public function pourTous(): static
    {
        return $this->state(fn (array $attributes) => [
            'cible' => 'tous',
        ]);
    }

    public function pourParents(): static
    {
        return $this->state(fn (array $attributes) => [
            'cible' => 'parents',
        ]);
    }

    public function pourEducateurs(): static
    {
        return $this->state(fn (array $attributes) => [
            'cible' => 'educateurs',
        ]);
    }

    public function expiree(): static
    {
        return $this->state(fn (array $attributes) => [
            'expire_le' => fake()->dateTimeBetween('-30 days', '-1 days'),
        ]);
    }
}
