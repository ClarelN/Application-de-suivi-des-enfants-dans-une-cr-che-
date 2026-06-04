<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TarifResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'groupe_id'         => $this->groupe_id,
            'montant_mensuel'   => $this->montant_mensuel,
            'frais_inscription' => $this->frais_inscription,
            'date_effet'        => $this->date_effet?->format('Y-m-d'),
            'actif'             => (bool) $this->actif,
            'groupe'            => $this->whenLoaded('groupe', fn() => [
                'id'  => $this->groupe->id,
                'nom' => $this->groupe->nom,
            ]),
        ];
    }
}
