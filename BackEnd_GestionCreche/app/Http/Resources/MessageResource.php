<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'sujet'        => $this->sujet,
            'corps'        => $this->corps,
            'lu'           => (bool) $this->lu,
            'expediteur'   => new UtilisateurResource($this->whenLoaded('expediteur')),
            'destinataire' => new UtilisateurResource($this->whenLoaded('destinataire')),
            'envoye_le'    => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
