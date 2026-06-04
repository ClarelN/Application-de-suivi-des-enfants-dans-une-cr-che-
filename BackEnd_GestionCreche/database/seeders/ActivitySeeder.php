<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Groupe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $activites = [
            ['titre' => 'Éveil sensoriel',  'desc' => 'Exploration de textures et matières',   'offset' => 1, 'duree' => 60],
            ['titre' => 'Atelier peinture', 'desc' => 'Peinture aux doigts sur grande feuille', 'offset' => 3, 'duree' => 45],
        ];

        foreach (Groupe::all() as $groupe) {
            foreach ($activites as $a) {
                Activity::create([
                    'title'       => $a['titre'],
                    'description' => $a['desc'],
                    'start_time'  => now()->subDays($a['offset'])->setTime(10, 0),
                    'end_time'    => now()->subDays($a['offset'])->setTime(10, 0)->addMinutes($a['duree']),
                ]);
            }
        }
    }
}
