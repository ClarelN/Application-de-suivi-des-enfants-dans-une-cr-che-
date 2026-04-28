<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockLogistiqueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'produit'           => $this->produit,
            'quantite_actuelle' => (float) $this->quantite_actuelle,
            'unite'             => $this->unite,
            'seuil_alerte'      => (float) $this->seuil_alerte,
            'en_alerte'         => $this->estEnAlerte(),
        ];
    }
}
