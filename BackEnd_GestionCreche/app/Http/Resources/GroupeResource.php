<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'nom'             => $this->nom,
            'age_min_mois'    => $this->age_min_mois,
            'age_max_mois'    => $this->age_max_mois,
            'capacite_max'    => $this->capacite_max,
            'couleur'         => $this->couleur,
            'taux_occupation' => $this->getTauxOccupation(),
            'nb_enfants'      => $this->whenCounted('enfants'),
            'created_at'      => $this->created_at->format('d/m/Y'),
        ];
    }
}
