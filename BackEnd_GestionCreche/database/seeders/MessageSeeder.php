<?php
// database/seeders/MessageSeeder.php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $utilisateurs = Utilisateur::pluck('id')->toArray();

        if (count($utilisateurs) < 2) {
            // Créer au moins 2 utilisateurs pour les messages
            $user1 = Utilisateur::factory()->parent()->create();
            $user2 = Utilisateur::factory()->educateur()->create();
            $utilisateurs = [$user1->id, $user2->id];
        }

        // Créer 30 messages
        for ($i = 0; $i < 30; $i++) {
            // Sélectionner 2 utilisateurs différents
            $indices = array_rand($utilisateurs, 2);
            $expediteurId = $utilisateurs[$indices[0]];
            $destinataireId = $utilisateurs[$indices[1]];

            // S'assurer qu'ils sont différents
            if ($expediteurId === $destinataireId) {
                $destinataireId = $utilisateurs[($indices[1] + 1) % count($utilisateurs)];
            }

            $lu = fake()->boolean(50);

            Message::create([
                'expediteur_id' => $expediteurId,
                'destinataire_id' => $destinataireId,
                'sujet' => fake()->sentence(),
                'corps' => fake()->paragraph(3),
                'lu' => $lu,
            ]);
        }
    }
}
