<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    use HasFactory;

    protected $fillable = [
        'groupe_id',
        'montant_mensuel',
        'frais_inscription',
        'date_effet',
        'actif',
    ];

    protected $casts = [
        'montant_mensuel'   => 'decimal:2',
        'frais_inscription' => 'decimal:2',
        'date_effet'        => 'date',
        'actif'             => 'boolean',
    ];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }
}
