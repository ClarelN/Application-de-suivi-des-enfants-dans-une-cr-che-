<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Groupe extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nom',
        'age_min_mois',
        'age_max_mois',
        'capacite_max',
        'couleur',
    ];

    public function enfants()
    {
        return $this->hasMany(Enfant::class);
    }

    public function educateurs()
    {
        return $this->belongsToMany(Utilisateur::class, 'educateur_groupe', 'groupe_id', 'educateur_id');
    }

    public function tarifs()
    {
        return $this->hasMany(Tarif::class);
    }

    public function getTauxOccupation(): float
    {
        if ($this->capacite_max === 0) return 0;
        return round(($this->enfants()->count() / $this->capacite_max) * 100, 2);
    }
}
