<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'titre'       => $this->title,
            'description' => $this->description,
            'debut'       => $this->start_time?->format('d/m/Y H:i'),
            'fin'         => $this->end_time?->format('d/m/Y H:i'),
            'nb_enfants'  => $this->whenCounted('enfants'),
            'enfants'     => EnfantResource::collection($this->whenLoaded('enfants')),
            'cree_le'     => $this->created_at?->format('d/m/Y'),
        ];
    }
}
