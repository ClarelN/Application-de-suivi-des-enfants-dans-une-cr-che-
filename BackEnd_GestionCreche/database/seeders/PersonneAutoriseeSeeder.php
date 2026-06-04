<?php

namespace Database\Seeders;

use App\Models\Enfant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PersonneAutoriseeSeeder extends Seeder
{
    use WithoutModelEvents;

    // Une personne autorisée par enfant
    protected array $data = [
        'Emma Amougou'   => ['nom' => 'Amougou', 'prenom' => 'André',     'lien' => 'Grand-père', 'tel' => '06 11 22 33 44'],
        'Léo Fouda'      => ['nom' => 'Fouda',   'prenom' => 'Hélène',    'lien' => 'Grand-mère', 'tel' => '06 22 33 44 55'],
        'Camille Nguele' => ['nom' => 'Nguele',  'prenom' => 'Bertrand',  'lien' => 'Oncle',      'tel' => '06 33 44 55 66'],
        'Noah Tsogo'     => ['nom' => 'Tsogo',   'prenom' => 'Cécile',    'lien' => 'Tante',      'tel' => '06 44 55 66 77'],
        'Jade Mbarga'    => ['nom' => 'Mbarga',  'prenom' => 'Georges',   'lien' => 'Grand-père', 'tel' => '06 55 66 77 88'],
        'Hugo Abena'     => ['nom' => 'Abena',   'prenom' => 'Isabelle',  'lien' => 'Grand-mère', 'tel' => '06 66 77 88 99'],
        'Inès Mengue'    => ['nom' => 'Mengue',  'prenom' => 'François',  'lien' => 'Oncle',      'tel' => '06 77 88 99 00'],
        'Tom Etoa'       => ['nom' => 'Etoa',    'prenom' => 'Thérèse',   'lien' => 'Grand-mère', 'tel' => '06 88 99 00 11'],
        'Eva Ngo'        => ['nom' => 'Ngo',     'prenom' => 'Édouard',   'lien' => 'Grand-père', 'tel' => '06 99 00 11 22'],
        'Liam Owona'     => ['nom' => 'Owona',   'prenom' => 'Marguerite','lien' => 'Nourrice',   'tel' => '06 00 11 22 33'],
        'Zoé Bekono'     => ['nom' => 'Bekono',  'prenom' => 'Samuel',    'lien' => 'Oncle',      'tel' => '06 11 33 55 77'],
        'Maxime Tagne'   => ['nom' => 'Tagne',   'prenom' => 'Lucie',     'lien' => 'Tante',      'tel' => '06 22 44 66 88'],
    ];

    public function run(): void
    {
        foreach ($this->data as $enfantFullName => $pa) {
            [$prenom, $nom] = explode(' ', $enfantFullName, 2);
            $enfant = Enfant::where('prenom', $prenom)->where('nom', $nom)->first();
            if (!$enfant) continue;

            if ($enfant->personnesAutorisees()->count() === 0) {
                $enfant->personnesAutorisees()->create([
                    'nom'          => $pa['nom'],
                    'prenom'       => $pa['prenom'],
                    'lien_parente' => $pa['lien'],
                    'telephone'    => $pa['tel'],
                ]);
            }
        }
    }
}
