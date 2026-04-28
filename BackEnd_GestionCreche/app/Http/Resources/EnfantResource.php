<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnfantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'nom'            => $this->nom,
            'prenom'         => $this->prenom,
            'date_naissance' => $this->date_naissance?->format('d/m/Y'),
            'age_mois'       => $this->date_naissance?->diffInMonths(now()),
            'sexe'           => $this->sexe,
            'photo'          => $this->photo_chemin
                                    ? asset('storage/' . $this->photo_chemin)
                                    : null,
            'allergie'       => $this->allergie,
            'obs_medicale'   => $this->obs_medicale,
            'statut'         => $this->statut,
            'groupe'         => new GroupeResource($this->whenLoaded('groupe')),
            'personnes_autorisees' => PersonneAutoriseeResource::collection(
                $this->whenLoaded('personnesAutorisees')
            ),
            'created_at'     => $this->created_at?->format('d/m/Y'),
        ];
    }
}
