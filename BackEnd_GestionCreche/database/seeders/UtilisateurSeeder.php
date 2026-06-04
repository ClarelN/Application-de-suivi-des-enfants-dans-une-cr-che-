<?php

namespace Database\Seeders;

use App\Models\Groupe;
use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ── 1 Administrateur ─────────────────────────────────────────────────
        Utilisateur::firstOrCreate(
            ['email' => 'admin@creche.cm'],
            [
                'nom'      => 'Admin',
                'prenom'   => 'Crèche',
                'password' => Hash::make('password123'),
                'role'     => 'administrateur',
                'actif'    => true,
            ]
        );

        // ── 6 Éducateurs, un par classe ──────────────────────────────────────
        $educateurs = [
            ['email' => 'edu.poussins@creche.cm',    'nom' => 'Nkono',  'prenom' => 'Claire',    'classe' => 'Poussins'],
            ['email' => 'edu.papillons@creche.cm',   'nom' => 'Ateba',  'prenom' => 'Paul',      'classe' => 'Papillons'],
            ['email' => 'edu.coccinelles@creche.cm', 'nom' => 'Mfou',   'prenom' => 'Sarah',     'classe' => 'Coccinelles'],
            ['email' => 'edu.petits@creche.cm',      'nom' => 'Biya',   'prenom' => 'Marc',      'classe' => 'Petits'],
            ['email' => 'edu.moyens@creche.cm',      'nom' => 'Essam',  'prenom' => 'Julie',     'classe' => 'Moyens'],
            ['email' => 'edu.grands@creche.cm',      'nom' => 'Mvondo', 'prenom' => 'Pierre',    'classe' => 'Grands'],
        ];

        foreach ($educateurs as $data) {
            $edu = Utilisateur::firstOrCreate(
                ['email' => $data['email']],
                [
                    'nom'      => $data['nom'],
                    'prenom'   => $data['prenom'],
                    'password' => Hash::make('password123'),
                    'role'     => 'educateur',
                    'actif'    => true,
                ]
            );

            // Lier l'éducateur à sa classe via le pivot educateur_groupe
            $groupe = Groupe::where('nom', $data['classe'])->first();
            if ($groupe && !$edu->groupes()->where('groupe_id', $groupe->id)->exists()) {
                $edu->groupes()->attach($groupe->id);
            }
        }

        // ── 12 Parents (2 par classe) ─────────────────────────────────────────
        $parents = [
            ['email' => 'parent.amougou@creche.cm', 'nom' => 'Amougou', 'prenom' => 'Sophie'],
            ['email' => 'parent.fouda@creche.cm',   'nom' => 'Fouda',   'prenom' => 'Jean'  ],
            ['email' => 'parent.nguele@creche.cm',  'nom' => 'Nguele',  'prenom' => 'Marie' ],
            ['email' => 'parent.tsogo@creche.cm',   'nom' => 'Tsogo',   'prenom' => 'Robert'],
            ['email' => 'parent.mbarga@creche.cm',  'nom' => 'Mbarga',  'prenom' => 'Anne'  ],
            ['email' => 'parent.abena@creche.cm',   'nom' => 'Abena',   'prenom' => 'Paul'  ],
            ['email' => 'parent.mengue@creche.cm',  'nom' => 'Mengue',  'prenom' => 'Claire'],
            ['email' => 'parent.etoa@creche.cm',    'nom' => 'Etoa',    'prenom' => 'Michel'],
            ['email' => 'parent.ngo@creche.cm',     'nom' => 'Ngo',     'prenom' => 'Christine'],
            ['email' => 'parent.owona@creche.cm',   'nom' => 'Owona',   'prenom' => 'Louis' ],
            ['email' => 'parent.bekono@creche.cm',  'nom' => 'Bekono',  'prenom' => 'Fatou' ],
            ['email' => 'parent.tagne@creche.cm',   'nom' => 'Tagne',   'prenom' => 'Pierre'],
        ];

        foreach ($parents as $data) {
            Utilisateur::firstOrCreate(
                ['email' => $data['email']],
                [
                    'nom'      => $data['nom'],
                    'prenom'   => $data['prenom'],
                    'password' => Hash::make('password123'),
                    'role'     => 'parent',
                    'actif'    => true,
                ]
            );
        }
    }
}
