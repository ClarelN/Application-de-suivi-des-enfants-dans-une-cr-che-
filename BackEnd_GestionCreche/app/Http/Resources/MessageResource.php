<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'sujet'           => $this->sujet,
            'corps'           => $this->corps,
            'lu'              => (bool) $this->lu,
            'expediteur_id'   => $this->expediteur_id,
            'destinataire_id' => $this->destinataire_id,
            'expediteur'      => new UtilisateurResource($this->whenLoaded('expediteur')),
            'destinataire'    => new UtilisateurResource($this->whenLoaded('destinataire')),
            'fichier_url'     => $this->fichier_chemin
                                    ? asset('storage/' . $this->fichier_chemin)
                                    : null,
            'fichier_type'    => $this->fichier_type,
            'fichier_nom'     => $this->fichier_nom,
            'fichier_taille'  => $this->fichier_taille,
            'envoye_le'       => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
