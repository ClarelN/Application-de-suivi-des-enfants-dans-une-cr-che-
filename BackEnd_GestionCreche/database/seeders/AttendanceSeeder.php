<?php
// database/seeders/AttendanceSeeder.php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Enfant;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttendanceSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $enfants = Enfant::all();
        $attendances = [];

        // Générer les présences sur les 30 derniers jours ouvrés
        $today = Carbon::now();
        $startDate = $today->copy()->subDays(30);
        
        foreach ($enfants as $enfant) {
            $currentDate = $startDate->copy();

            while ($currentDate <= $today) {
                // Exclure les weekends
                if ($currentDate->isWeekday()) {
                    $status = 'present';
                    
                    // 10% de probabilité d'absence
                    if (fake()->boolean(10)) {
                        $status = fake()->randomElement(['absent', 'retard']);
                    }

                    $attendances[] = [
                        'enfant_id' => $enfant->id,
                        'date' => $currentDate->format('Y-m-d'),
                        'status' => $status,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                $currentDate->addDay();
            }
        }

        // Insérer par chunks de 500 pour la performance
        $chunks = array_chunk($attendances, 500);
        foreach ($chunks as $chunk) {
            DB::table('attendances')->insert($chunk);
        }
    }
}
