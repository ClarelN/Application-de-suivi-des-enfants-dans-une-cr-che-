<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncidentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'type'         => $this->type,
            'description'  => $this->description,
            'gravite'      => $this->gravite,
            'traite'       => (bool) $this->traite,
            'date'         => $this->date?->format('Y-m-d'),
            'educateur_id' => $this->educateur_id,
            'enfant'       => $this->whenLoaded('enfant', fn() => [
                'id'     => $this->enfant->id,
                'prenom' => $this->enfant->prenom,
                'nom'    => $this->enfant->nom,
            ]),
            'created_at'   => $this->created_at?->format('d/m/Y'),
        ];
    }
}
