<?php
// database/seeders/UtilisateurSeeder.php

namespace Database\Seeders;

use App\Models\Utilisateur;
use App\Models\Groupe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer 1 administrateur fixe
        Utilisateur::firstOrCreate(
            ['email' => 'admin@creche.cm'],
            [
                'nom' => 'Admin',
                'prenom' => 'Crèche',
                'email' => 'admin@creche.cm',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'administrateur',
                'actif' => true,
            ]
        );

        // Créer 1 éducateur par groupe
        $groupes = Groupe::all();
        foreach ($groupes as $index => $groupe) {
            Utilisateur::factory()
                ->educateur()
                ->create([
                    'nom' => 'Educateur',
                    'prenom' => $groupe->nom,
                    'email' => 'educateur.' . strtolower($groupe->nom) . '@creche.cm',
                ]);
        }

        // Créer 20 parents
        Utilisateur::factory()
            ->parent()
            ->count(20)
            ->create();
    }
}
