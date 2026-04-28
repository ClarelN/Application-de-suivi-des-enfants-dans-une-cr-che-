<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasFactory;

    protected $fillable = [
        'enfant_id',
        'mois',
        'annee',
        'montant_du',
        'statut',
        'pdf_chemin',
    ];

    protected $casts = [
        'montant_du' => 'decimal:2',
    ];

    public function enfant()
    {
        return $this->belongsTo(Enfant::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}
