<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'facture_id',
        'montant',
        'mode',
        'date_paiement',
        'note',
    ];

    protected $casts = [
        'montant'        => 'decimal:2',
        'date_paiement'  => 'date',
    ];

    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }
}
