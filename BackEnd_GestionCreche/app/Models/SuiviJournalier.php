<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuiviJournalier extends Model
{
    use HasFactory;

    protected $table = 'suivis_journaliers';

    protected $fillable = [
        'enfant_id',
        'educateur_id',
        'date',
        'repas',
        'sieste_debut',
        'sieste_fin',
        'humeur',
        'note',
    ];

    protected $casts = [
        'date' => 'date',
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
