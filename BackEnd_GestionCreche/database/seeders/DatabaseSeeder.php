<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Désactiver les vérifications de clés étrangères pour le seeding
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->call([
            GroupeSeeder::class,
            UtilisateurSeeder::class,
            EnfantSeeder::class,
            ActivitySeeder::class,
            AttendanceSeeder::class,
            PersonneAutoriseeSeeder::class,
            MessageSeeder::class,
            EvenementSeeder::class,
            AnnonceSeeder::class,
        ]);

        // Réactiver les vérifications de clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
