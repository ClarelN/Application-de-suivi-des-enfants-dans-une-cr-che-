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

        $menus = [
            ['nom' => 'Déjeuner', 'desc' => 'Purée de légumes, compote de pomme', 'heure' => '12:00', 'offset' => 0],
            ['nom' => 'Goûter',   'desc' => 'Biscuits et jus de fruit',            'heure' => '16:00', 'offset' => 0],
            ['nom' => 'Déjeuner', 'desc' => 'Riz au poisson, yaourt',              'heure' => '12:00', 'offset' => 1],
            ['nom' => 'Goûter',   'desc' => 'Fruits frais de saison',              'heure' => '16:00', 'offset' => 1],
        ];

        $consommations = ['tout', 'un_peu', 'tout', 'tout', 'un_peu', 'tout',
                          'rien', 'tout',   'tout', 'un_peu','tout',  'tout'];

        foreach ($menus as $menu) {
            $repas = Repas::create([
                'nom_repas'   => $menu['nom'],
                'description' => $menu['desc'],
                'date'        => now()->subDays($menu['offset'])->format('Y-m-d'),
                'heure'       => $menu['heure'],
            ]);

            foreach ($enfants as $i => $enfantId) {
                $repas->enfants()->attach($enfantId, [
                    'quantite_mangee' => $consommations[$i % count($consommations)],
                    'commentaires'    => null,
                ]);
            }
        }
    }
}
