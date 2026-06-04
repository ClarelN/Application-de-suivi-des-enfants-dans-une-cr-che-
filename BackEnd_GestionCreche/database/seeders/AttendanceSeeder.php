<?php

namespace Database\Seeders;

use App\Models\Enfant;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttendanceSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $enfants = Enfant::all();

        // Les 5 derniers jours ouvrés
        $jours = [];
        $date  = Carbon::now();
        while (count($jours) < 5) {
            if ($date->isWeekday()) {
                $jours[] = $date->format('Y-m-d');
            }
            $date->subDay();
        }

        $rows = [];
        foreach ($enfants as $enfant) {
            foreach ($jours as $jour) {
                $rows[] = [
                    'enfant_id'  => $enfant->id,
                    'date'       => $jour,
                    'status'     => 'present',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('attendances')->insert($rows);
    }
}
