<?php
// database/factories/MessageFactory.php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        // Récupérer 2 utilisateurs différents au hasard
        $users = DB::table('utilisateurs')->inRandomOrder()->limit(2)->pluck('id')->toArray();
        
        if (count($users) < 2) {
            // Fallback : créer des utilisateurs s'il n'y en a pas assez
            $users = [1, 2];
        }

        return [
            'expediteur_id' => $users[0] ?? 1,
            'destinataire_id' => $users[1] ?? 2,
            'sujet' => fake()->sentence(),
            'corps' => fake()->paragraph(3),
            'lu' => false,
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
