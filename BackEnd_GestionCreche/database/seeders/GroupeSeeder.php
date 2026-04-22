<?php
// database/seeders/GroupeSeeder.php

namespace Database\Seeders;

use App\Models\Groupe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GroupeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groupes = [
            [
                'nom' => 'Poussins',
                'age_min_mois' => 2,
                'age_max_mois' => 12,
                'capacite_max' => 8,
                'couleur' => '#FFD700',
            ],
            [
                'nom' => 'Papillons',
                'age_min_mois' => 12,
                'age_max_mois' => 24,
                'capacite_max' => 10,
                'couleur' => '#FF69B4',
            ],
            [
                'nom' => 'Coccinelles',
                'age_min_mois' => 24,
                'age_max_mois' => 36,
                'capacite_max' => 12,
                'couleur' => '#FF0000',
            ],
            [
                'nom' => 'Petits',
                'age_min_mois' => 24,
                'age_max_mois' => 36,
                'capacite_max' => 12,
                'couleur' => '#FFA500',
            ],
            [
                'nom' => 'Moyens',
                'age_min_mois' => 36,
                'age_max_mois' => 48,
                'capacite_max' => 14,
                'couleur' => '#00CED1',
            ],
            [
                'nom' => 'Grands',
                'age_min_mois' => 48,
                'age_max_mois' => 60,
                'capacite_max' => 16,
                'couleur' => '#4169E1',
            ],
        ];

        foreach ($groupes as $groupe) {
            Groupe::firstOrCreate(
                ['nom' => $groupe['nom']],
                $groupe
            );
        }
    }
}
