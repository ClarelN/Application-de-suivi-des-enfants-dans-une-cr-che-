<?php
// database/seeders/AnnonceSeeder.php

namespace Database\Seeders;

use App\Models\Annonce;
use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnonceSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer un admin pour les annonces
        $admin = Utilisateur::where('role', 'administrateur')->first();

        if (!$admin) {
            // Créer un admin s'il n'existe pas
            $admin = Utilisateur::factory()->admin()->create();
        }

        $annonces = [
            [
                'user_id' => $admin->id,
                'titre' => 'Fermeture fête nationale',
                'corps' => 'La crèche sera fermée le 1er mai pour la fête nationale. Nous vous souhaitons une bonne fête !',
                'cible' => 'tous',
                'expire_le' => now()->addDays(30),
            ],
            [
                'user_id' => $admin->id,
                'titre' => 'Réunion parents bilan trimestriel',
                'corps' => 'Nous vous invitons à une réunion de présentation des progrès de vos enfants le 15 mai à 18h30.',
                'cible' => 'parents',
                'expire_le' => now()->addDays(20),
            ],
            [
                'user_id' => $admin->id,
                'titre' => 'Formation premiers secours',
                'corps' => 'Une formation aux premiers secours sera organisée pour l\'équipe éducative. Dates à confirmer.',
                'cible' => 'educateurs',
                'expire_le' => now()->addDays(45),
            ],
            [
                'user_id' => $admin->id,
                'titre' => 'Menu juin disponible',
                'corps' => 'Le menu du mois de juin est disponible sur l\'application. Bon appétit à tous les enfants !',
                'cible' => 'tous',
                'expire_le' => now()->addDays(15),
            ],
            [
                'user_id' => $admin->id,
                'titre' => 'Sortie pédagogique Zoo',
                'corps' => 'Une sortie au zoo est organisée le 20 juin. Les parents pourront nous accompagner. Inscription obligatoire.',
                'cible' => 'parents',
                'expire_le' => now()->addDays(25),
            ],
        ];

        foreach ($annonces as $annonce) {
            Annonce::create($annonce);
        }
    }
}
