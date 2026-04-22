<?php
// database/seeders/EnfantSeeder.php

namespace Database\Seeders;

use App\Models\Enfant;
use App\Models\Groupe;
use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnfantSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groupes = Groupe::all();
        $parents = Utilisateur::where('role', 'parent')->pluck('id')->toArray();

        foreach ($groupes as $groupe) {
            // Créer entre 6 et capacite_max enfants par groupe
            $count = fake()->numberBetween(6, $groupe->capacite_max);
            
            for ($i = 0; $i < $count; $i++) {
                $enfant = Enfant::factory()
                    ->create(['groupe_id' => $groupe->id]);

                // Rattacher 1 ou 2 parents aléatoires
                $parentsCount = fake()->numberBetween(1, 2);
                $selectedParents = array_slice(
                    $parents,
                    fake()->numberBetween(0, count($parents) - $parentsCount),
                    $parentsCount
                );

                // Créer une relation Many-To-Many
                foreach ($selectedParents as $parentId) {
                    \DB::table('enfant_parent')->updateOrInsert(
                        ['enfant_id' => $enfant->id, 'parent_id' => $parentId],
                        ['created_at' => now(), 'updated_at' => now()]
                    );
                }

                // Créer 1 ou 2 personnes autorisées
                $nbPersonnes = fake()->numberBetween(1, 2);
                for ($j = 0; $j < $nbPersonnes; $j++) {
                    $enfant->personnesAutorisees()->create([
                        'nom' => fake()->lastName(),
                        'prenom' => fake()->firstName(),
                        'lien_parente' => fake()->randomElement([
                            'Grand-mère',
                            'Grand-père',
                            'Oncle',
                            'Tante',
                            'Nourrice',
                        ]),
                        'telephone' => fake()->phoneNumber(),
                    ]);
                }
            }
        }
    }
}
