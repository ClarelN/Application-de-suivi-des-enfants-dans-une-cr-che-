<?php
// database/seeders/EvenementSeeder.php

namespace Database\Seeders;

use App\Models\Evenement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EvenementSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $evenements = [
            [
                'titre' => 'Sortie pédagogique Zoo',
                'description' => 'Visite au zoo pour découvrir les animaux',
                'date_debut' => now()->addDays(7),
                'date_fin' => now()->addDays(7)->addHours(3),
                'places_max' => 30,
            ],
            [
                'titre' => 'Fête de fin d\'année',
                'description' => 'Fête avec les parents et les enfants',
                'date_debut' => now()->addDays(30),
                'date_fin' => now()->addDays(30)->addHours(2),
                'places_max' => 100,
            ],
            [
                'titre' => 'Réunion parents bilan trimestriel',
                'description' => 'Présentation des progrès de chaque enfant',
                'date_debut' => now()->addDays(14),
                'date_fin' => now()->addDays(14)->addHours(2),
                'places_max' => 50,
            ],
            [
                'titre' => 'Atelier peinture avec parents',
                'description' => 'Activité créative parent-enfant',
                'date_debut' => now()->addDays(21),
                'date_fin' => now()->addDays(21)->addHours(1),
                'places_max' => 40,
            ],
            [
                'titre' => 'Spectacle de marionnettes',
                'description' => 'Animation pour divertir les enfants',
                'date_debut' => now()->addDays(45),
                'date_fin' => now()->addDays(45)->addHours(1),
                'places_max' => 60,
            ],
        ];

        foreach ($evenements as $evenement) {
            Evenement::create($evenement);
        }
    }
}
