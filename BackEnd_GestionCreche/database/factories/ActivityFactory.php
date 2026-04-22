<?php
// database/factories/ActivityFactory.php

namespace Database\Factories;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    protected $titles = [
        'Atelier peinture',
        'Lecture',
        'Jeux libres',
        'Musique',
        'Motricité fine',
        'Éveil sensoriel',
        'Comptines',
        'Jardinage',
    ];

    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('-30 days', 'now');
        $endTime = (clone $startTime)->modify('+1 hour');

        return [
            'title' => fake()->randomElement($this->titles),
            'description' => fake()->optional(0.6)->sentence(10),
            'start_time' => $startTime,
            'end_time' => $endTime,
        ];
    }

    public function peinture(): static
    {
        return $this->state(fn (array $attributes) => [
            'title' => 'Atelier peinture',
            'description' => 'Atelier créatif avec peinture et pinceau',
        ]);
    }

    public function lecture(): static
    {
        return $this->state(fn (array $attributes) => [
            'title' => 'Lecture',
            'description' => 'Lecture d\'histoires et contes',
        ]);
    }

    public function musique(): static
    {
        return $this->state(fn (array $attributes) => [
            'title' => 'Musique',
            'description' => 'Activité musicale avec instruments simples',
        ]);
    }
}
