<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FactureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'mois'        => $this->mois,
            'annee'       => $this->annee,
            'montant_du'  => $this->montant_du,
            'statut'      => $this->statut,
            'pdf_chemin'  => $this->pdf_chemin,
            'enfant'      => $this->whenLoaded('enfant', fn() => [
                'id'     => $this->enfant->id,
                'prenom' => $this->enfant->prenom,
                'nom'    => $this->enfant->nom,
            ]),
        ];
    }
}
