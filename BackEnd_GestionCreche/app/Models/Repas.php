<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Repas extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nom_repas',
        'description',
        'date',
        'heure',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Un repas concerne plusieurs enfants via la table pivot
    public function enfants()
    {
        return $this->belongsToMany(
            Enfant::class,
            'consommation_repas',
            'repas_id',
            'enfant_id'
        )->withPivot('quantite_mangee', 'commentaires')
         ->withTimestamps();
    }

    // Vérifier si un enfant a tout mangé
    public function aToutMange(int $enfantId): bool
    {
        return $this->enfants()
            ->where('enfant_id', $enfantId)
            ->wherePivot('quantite_mangee', 'tout')
            ->exists();
    }
}
