<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SuiviJournalierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'enfant_id'    => $this->enfant_id,
            'educateur_id' => $this->educateur_id,
            'date'         => $this->date?->format('Y-m-d'),
            'repas'        => $this->repas,
            'sieste_debut' => $this->sieste_debut,
            'sieste_fin'   => $this->sieste_fin,
            'humeur'       => $this->humeur,
            'note'         => $this->note,
            'enfant'       => $this->whenLoaded('enfant', fn() => [
                'id'     => $this->enfant->id,
                'prenom' => $this->enfant->prenom,
                'nom'    => $this->enfant->nom,
            ]),
        ];
    }
}
