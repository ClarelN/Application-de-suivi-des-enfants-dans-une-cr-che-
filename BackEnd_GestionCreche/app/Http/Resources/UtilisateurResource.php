<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UtilisateurResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'     => $this->id,
            'nom'    => $this->nom,
            'prenom' => $this->prenom,
            'email'  => $this->email,
            'role'   => $this->role,
        ];
    }
}
