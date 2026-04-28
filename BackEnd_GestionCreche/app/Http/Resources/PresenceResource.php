<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PresenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'enfant_id'  => $this->enfant_id,
            'enfant'     => new EnfantResource($this->whenLoaded('enfant')),
            'date'       => $this->date?->format('d/m/Y'),
            'statut'     => $this->status,
            'enregistre_le' => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
