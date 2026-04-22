<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonneAutorisee extends Model
{
    protected $fillable = [
        'enfant_id',
        'nom',
        'prenom',
        'lien_parente',
        'telephone',
    ];

    // Une personne autorisée appartient à un enfant
    public function enfant()
    {
        return $this->belongsTo(Enfant::class);
    }
}
