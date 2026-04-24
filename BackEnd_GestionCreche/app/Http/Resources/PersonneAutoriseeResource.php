<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonneAutoriseeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'nom'          => $this->nom,
            'prenom'       => $this->prenom,
            'lien_parente' => $this->lien_parente,
            'telephone'    => $this->telephone,
            'enfant_id'    => $this->enfant_id,
        ];
    }
}
