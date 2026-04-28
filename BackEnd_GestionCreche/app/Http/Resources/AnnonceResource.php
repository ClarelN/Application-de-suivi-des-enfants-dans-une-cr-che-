<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnonceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'titre'     => $this->titre,
            'corps'     => $this->corps,
            'cible'     => $this->cible,
            'expire_le' => $this->expire_le?->format('d/m/Y H:i'),
            'auteur'    => new UtilisateurResource($this->whenLoaded('auteur')),
            'publie_le' => $this->created_at?->format('d/m/Y'),
        ];
    }
}
