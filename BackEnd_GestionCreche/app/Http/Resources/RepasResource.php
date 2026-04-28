<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RepasResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nom_repas'   => $this->nom_repas,
            'description' => $this->description,
            'date'        => $this->date?->format('d/m/Y'),
            'heure'       => $this->heure,
            'consommations' => $this->whenLoaded('enfants', fn() =>
                $this->enfants->map(fn($enfant) => [
                    'enfant_id'      => $enfant->id,
                    'nom'            => $enfant->nom,
                    'prenom'         => $enfant->prenom,
                    'quantite_mangee'=> $enfant->pivot->quantite_mangee,
                    'commentaires'   => $enfant->pivot->commentaires,
                ])
            ),
            'cree_le'     => $this->created_at?->format('d/m/Y'),
        ];
    }
}
