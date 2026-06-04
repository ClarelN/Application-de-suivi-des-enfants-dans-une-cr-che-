<?php

namespace Database\Seeders;

use App\Models\Enfant;
use App\Models\Groupe;
use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnfantSeeder extends Seeder
{
    use WithoutModelEvents;

    // 2 enfants par classe, chacun lié à un parent précis
    // date_naissance calculée à partir du 2026-05-01
    protected array $data = [
        // Poussins (2-12 mois)
        ['classe' => 'Poussins',    'parent_email' => 'parent.amougou@creche.cm', 'prenom' => 'Emma',    'nom' => 'Amougou', 'dob' => '2025-12-20', 'sexe' => 'F', 'allergie' => null],
        ['classe' => 'Poussins',    'parent_email' => 'parent.fouda@creche.cm',   'prenom' => 'Léo',     'nom' => 'Fouda',   'dob' => '2025-08-28', 'sexe' => 'M', 'allergie' => null],
        // Papillons (12-24 mois)
        ['classe' => 'Papillons',   'parent_email' => 'parent.nguele@creche.cm',  'prenom' => 'Camille', 'nom' => 'Nguele',  'dob' => '2025-01-28', 'sexe' => 'F', 'allergie' => null],
        ['classe' => 'Papillons',   'parent_email' => 'parent.tsogo@creche.cm',   'prenom' => 'Noah',    'nom' => 'Tsogo',   'dob' => '2024-08-31', 'sexe' => 'M', 'allergie' => 'Arachides'],
        // Coccinelles (24-36 mois)
        ['classe' => 'Coccinelles', 'parent_email' => 'parent.mbarga@creche.cm',  'prenom' => 'Jade',    'nom' => 'Mbarga',  'dob' => '2024-01-01', 'sexe' => 'F', 'allergie' => null],
        ['classe' => 'Coccinelles', 'parent_email' => 'parent.abena@creche.cm',   'prenom' => 'Hugo',    'nom' => 'Abena',   'dob' => '2023-09-01', 'sexe' => 'M', 'allergie' => null],
        // Petits (24-36 mois)
        ['classe' => 'Petits',      'parent_email' => 'parent.mengue@creche.cm',  'prenom' => 'Inès',    'nom' => 'Mengue',  'dob' => '2023-11-01', 'sexe' => 'F', 'allergie' => null],
        ['classe' => 'Petits',      'parent_email' => 'parent.etoa@creche.cm',    'prenom' => 'Tom',     'nom' => 'Etoa',    'dob' => '2023-07-01', 'sexe' => 'M', 'allergie' => null],
        // Moyens (36-48 mois)
        ['classe' => 'Moyens',      'parent_email' => 'parent.ngo@creche.cm',     'prenom' => 'Eva',     'nom' => 'Ngo',     'dob' => '2023-01-01', 'sexe' => 'F', 'allergie' => null],
        ['classe' => 'Moyens',      'parent_email' => 'parent.owona@creche.cm',   'prenom' => 'Liam',    'nom' => 'Owona',   'dob' => '2022-09-01', 'sexe' => 'M', 'allergie' => 'Gluten'],
        // Grands (48-60 mois)
        ['classe' => 'Grands',      'parent_email' => 'parent.bekono@creche.cm',  'prenom' => 'Zoé',     'nom' => 'Bekono',  'dob' => '2022-03-01', 'sexe' => 'F', 'allergie' => null],
        ['classe' => 'Grands',      'parent_email' => 'parent.tagne@creche.cm',   'prenom' => 'Maxime',  'nom' => 'Tagne',   'dob' => '2021-09-01', 'sexe' => 'M', 'allergie' => null],
    ];

    public function run(): void
    {
        foreach ($this->data as $row) {
            $groupe = Groupe::where('nom', $row['classe'])->firstOrFail();
            $parent = Utilisateur::where('email', $row['parent_email'])->firstOrFail();

            $enfant = Enfant::firstOrCreate(
                ['prenom' => $row['prenom'], 'nom' => $row['nom']],
                [
                    'groupe_id'      => $groupe->id,
                    'date_naissance' => $row['dob'],
                    'sexe'           => $row['sexe'],
                    'allergie'       => $row['allergie'],
                    'obs_medicale'   => null,
                    'statut'         => 'actif',
                ]
            );

            // Lien enfant ↔ parent
            DB::table('enfant_parent')->updateOrInsert(
                ['enfant_id' => $enfant->id, 'parent_id' => $parent->id],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
