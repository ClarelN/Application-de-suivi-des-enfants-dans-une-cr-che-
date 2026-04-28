<?php

namespace Database\Seeders;

use App\Models\Enfant;
use App\Models\Repas;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RepasSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $enfants = Enfant::pluck('id')->toArray();
        $noms    = ['Déjeuner', 'Goûter', 'Petit-déjeuner'];

        // 20 repas sur les 10 derniers jours
        for ($i = 0; $i < 20; $i++) {
            $date  = now()->subDays(rand(0, 9))->format('Y-m-d');
            $heure = fake()->randomElement(['08:00', '12:00', '16:00']);

            $repas = Repas::create([
                'nom_repas'   => fake()->randomElement($noms),
                'description' => fake()->optional(0.6)->sentence(6),
                'date'        => $date,
                'heure'       => $heure,
            ]);

            // Attacher 3 à 6 enfants avec leur consommation
            $echantillon = array_slice($enfants, 0, rand(3, min(6, count($enfants))));
            foreach ($echantillon as $enfantId) {
                $repas->enfants()->attach($enfantId, [
                    'quantite_mangee' => fake()->randomElement(['tout', 'un_peu', 'rien']),
                    'commentaires'    => fake()->optional(0.3)->sentence(4),
                ]);
            }
        }
    }
}
