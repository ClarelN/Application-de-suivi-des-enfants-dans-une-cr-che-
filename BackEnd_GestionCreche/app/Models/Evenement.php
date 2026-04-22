<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evenement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'places_max',
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin'   => 'datetime',
    ];

    // Enfants inscrits à cet événement
    public function enfants()
    {
        return $this->belongsToMany(Enfant::class, 'evenement_enfant');
    }

    // Nombre de places restantes
    public function placesRestantes(): int
    {
        if (!$this->places_max) return 999;
        return $this->places_max - $this->enfants()->count();
    }
}
