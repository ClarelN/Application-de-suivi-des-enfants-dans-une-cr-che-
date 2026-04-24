<?php
// database/seeders/PersonneAutoriseeSeeder.php

namespace Database\Seeders;

use App\Models\PersonneAutorisee;
use App\Models\Enfant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PersonneAutoriseeSeeder extends Seeder
{
    use WithoutModelEvents;

    protected $liens = [
        'Grand-mère',
        'Grand-père',
        'Oncle',
        'Tante',
        'Nourrice',
        'Autre parent',
        'Tuteur',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $enfants = Enfant::all();

        foreach ($enfants as $enfant) {
            // Vérifier si des personnes autorisées existent déjà pour cet enfant
            if ($enfant->personnesAutorisees()->count() === 0) {
                // Créer 1 ou 2 personnes autorisées
                $count = fake()->numberBetween(1, 2);

                for ($i = 0; $i < $count; $i++) {
                    PersonneAutorisee::create([
                        'enfant_id' => $enfant->id,
                        'nom' => fake()->lastName(),
                        'prenom' => fake()->firstName(),
                        'lien_parente' => fake()->randomElement($this->liens),
                        'telephone' => fake()->phoneNumber(),
                    ]);
                }
            }
        }
    }
}
