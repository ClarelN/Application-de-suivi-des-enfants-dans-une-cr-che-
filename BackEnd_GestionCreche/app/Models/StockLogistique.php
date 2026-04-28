<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockLogistique extends Model
{
    use HasFactory;
    protected $fillable = [
        'produit',
        'quantite_actuelle',
        'unite',
        'seuil_alerte',
    ];

    protected $casts = [
        'quantite_actuelle' => 'decimal:2',
        'seuil_alerte'      => 'decimal:2',
    ];

    // Vérifier si le stock est en dessous du seuil d'alerte
    public function estEnAlerte(): bool
    {
        return $this->quantite_actuelle <= $this->seuil_alerte;
    }

    // Scope pour récupérer uniquement les produits en alerte
    public function scopeEnAlerte($query)
    {
        return $query->whereColumn(
            'quantite_actuelle', '<=', 'seuil_alerte'
        );
    }
}
