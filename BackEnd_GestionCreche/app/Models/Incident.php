<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'enfant_id',
        'educateur_id',
        'date',
        'type',
        'description',
        'gravite',
        'traite',
    ];

    protected $casts = [
        'date'   => 'date',
        'traite' => 'boolean',
    ];

    public function enfant()
    {
        return $this->belongsTo(Enfant::class);
    }

    public function educateur()
    {
        return $this->belongsTo(Utilisateur::class, 'educateur_id');
    }
}
