<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Quelques conversations représentatives entre parents et éducateurs de leurs enfants
        $conversations = [
            // Sophie Amougou ↔ Claire Nkono (Poussins)
            ['de' => 'parent.amougou@creche.cm', 'a' => 'edu.poussins@creche.cm', 'corps' => 'Bonjour Claire, comment s\'est passée la journée d\'Emma aujourd\'hui ?', 'lu' => true,  'offset' => 2],
            ['de' => 'edu.poussins@creche.cm', 'a' => 'parent.amougou@creche.cm', 'corps' => 'Bonjour Sophie ! Emma a très bien mangé et fait une belle sieste de 13h30 à 15h. Elle était souriante toute la journée.', 'lu' => true, 'offset' => 2],
            ['de' => 'parent.amougou@creche.cm', 'a' => 'edu.poussins@creche.cm', 'corps' => 'Merci ! Elle est un peu enrhumée ce matin, je voulais vous prévenir.', 'lu' => false, 'offset' => 0],

            // Jean Fouda ↔ Claire Nkono (Poussins)
            ['de' => 'parent.fouda@creche.cm', 'a' => 'edu.poussins@creche.cm', 'corps' => 'Bonjour, Léo sera absent demain pour un rendez-vous médical.', 'lu' => true,  'offset' => 1],
            ['de' => 'edu.poussins@creche.cm', 'a' => 'parent.fouda@creche.cm', 'corps' => 'Bien noté, merci pour l\'information. Bon rétablissement à Léo !', 'lu' => true, 'offset' => 1],

            // Marie Nguele ↔ Paul Ateba (Papillons)
            ['de' => 'parent.nguele@creche.cm', 'a' => 'edu.papillons@creche.cm', 'corps' => 'Bonjour Paul, est-ce que Camille a bien dormi aujourd\'hui ?', 'lu' => true,  'offset' => 3],
            ['de' => 'edu.papillons@creche.cm', 'a' => 'parent.nguele@creche.cm', 'corps' => 'Oui, elle a fait une sieste de 14h à 15h30. Elle a aussi bien participé à l\'atelier peinture ce matin !', 'lu' => true, 'offset' => 3],

            // Robert Tsogo ↔ Paul Ateba (Papillons)
            ['de' => 'parent.tsogo@creche.cm', 'a' => 'edu.papillons@creche.cm', 'corps' => 'Bonjour, je voulais vous signaler que Noah a une allergie aux arachides. Elle est notée dans son dossier mais je préfère vous le rappeler.', 'lu' => false, 'offset' => 0],

            // admin ↔ Claire Nkono
            ['de' => 'admin@creche.cm', 'a' => 'edu.poussins@creche.cm', 'corps' => 'Bonjour Claire, merci de compléter les suivis de la semaine avant vendredi.', 'lu' => false, 'offset' => 1],

            // Christine Ngo ↔ Julie Essam (Moyens)
            ['de' => 'parent.ngo@creche.cm', 'a' => 'edu.moyens@creche.cm', 'corps' => 'Bonjour Julie, Eva peut-elle rester un peu plus tard ce soir jusqu\'à 18h30 ?', 'lu' => true,  'offset' => 2],
            ['de' => 'edu.moyens@creche.cm', 'a' => 'parent.ngo@creche.cm', 'corps' => 'Bien sûr, pas de problème. Nous l\'attendrons.', 'lu' => true, 'offset' => 2],
        ];

        foreach ($conversations as $conv) {
            $exp = Utilisateur::where('email', $conv['de'])->first();
            $dest = Utilisateur::where('email', $conv['a'])->first();
            if (!$exp || !$dest) continue;

            Message::create([
                'expediteur_id'  => $exp->id,
                'destinataire_id'=> $dest->id,
                'sujet'          => '',
                'corps'          => $conv['corps'],
                'lu'             => $conv['lu'],
                'created_at'     => now()->subDays($conv['offset']),
                'updated_at'     => now()->subDays($conv['offset']),
            ]);
        }
    }
}
