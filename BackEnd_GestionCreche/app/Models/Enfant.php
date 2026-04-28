<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enfant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nom',
        'prenom',
        'date_naissance',
        'sexe',
        'photo_chemin',
        'allergie',
        'obs_medicale',
        'statut',
        'groupe_id',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function parents()
    {
        return $this->belongsToMany(Utilisateur::class, 'enfant_parent', 'enfant_id', 'parent_id')
                    ->withPivot('lien_parente', 'responsable_principal')
                    ->withTimestamps();
    }

    public function personnesAutorisees()
    {
        return $this->hasMany(PersonneAutorisee::class);
    }

    public function presences()
    {
        return $this->hasMany(Attendance::class);
    }

    public function repas()
    {
        return $this->belongsToMany(Repas::class, 'consommation_repas', 'enfant_id', 'repas_id')
                    ->withPivot('quantite_mangee', 'commentaires')
                    ->withTimestamps();
    }

    public function activites()
    {
        return $this->belongsToMany(Activity::class, 'activity_enfant', 'enfant_id', 'activity_id');
    }

    public function factures()
    {
        return $this->hasMany(Facture::class);
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    public function suivisJournaliers()
    {
        return $this->hasMany(SuiviJournalier::class);
    }
}
