<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Groupe extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nom',
        'age_min_mois',
        'age_max_mois',
        'capacite_max',
        'couleur',
    ];

    // Un groupe a plusieurs enfants
    public function enfants()
    {
        return $this->hasMany(Enfant::class);
    }

    // Un groupe a plusieurs éducateurs (pivot)
    public function educateurs()
    {
        return $this->belongsToMany(User::class, 'educateur_groupe', 'groupe_id', 'user_id');
    }

    // Un groupe a plusieurs tarifs
    public function tarifs()
    {
        return $this->hasMany(Tarif::class);
    }

    // Taux d'occupation du groupe
    public function getTauxOccupation(): float
    {
        if ($this->capacite_max === 0) return 0;
        return round(($this->enfants()->count() / $this->capacite_max) * 100, 2);
    }
}
