<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'expediteur_id'   => Utilisateur::factory(),
            'destinataire_id' => Utilisateur::factory(),
            'sujet'           => fake()->sentence(),
            'corps'           => fake()->paragraph(3),
            'lu'              => false,
        ];
    }

    public function lu(): static
    {
        return $this->state(fn (array $attributes) => [
            'lu' => true,
        ]);
    }

    public function nonLu(): static
    {
        return $this->state(fn (array $attributes) => [
            'lu' => false,
        ]);
    }
}
