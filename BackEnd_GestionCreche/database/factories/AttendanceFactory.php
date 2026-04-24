<?php
// database/factories/AttendanceFactory.php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\Enfant;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    public function definition(): array
    {
        return [
            'enfant_id' => Enfant::factory(),
            'date' => fake()->dateTimeBetween('-30 days', 'now'),
            'status' => fake()->randomElement(['present', 'absent', 'retard']),
        ];
    }

    public function present(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'present',
        ]);
    }

    public function absent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'absent',
        ]);
    }

    public function retard(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'retard',
        ]);
    }
}
