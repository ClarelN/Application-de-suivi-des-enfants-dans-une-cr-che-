<?php
// database/seeders/ActivitySeeder.php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Groupe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    use WithoutModelEvents;

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

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groupes = Groupe::all();

        foreach ($groupes as $groupe) {
            // Créer 5 à 10 activités par groupe
            $count = fake()->numberBetween(5, 10);

            for ($i = 0; $i < $count; $i++) {
                $startTime = fake()->dateTimeBetween('-30 days', 'now');
                $endTime = (clone $startTime)->modify('+1 hour');

                Activity::create([
                    'title' => fake()->randomElement($this->titles),
                    'description' => fake()->optional(0.6)->sentence(8),
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                ]);
            }
        }
    }
}
