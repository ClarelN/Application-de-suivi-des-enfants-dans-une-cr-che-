<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enfant extends Model
{
    use SoftDeletes;

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

    // Un enfant appartient à un groupe
    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    // Un enfant a plusieurs parents (pivot)
    public function parents()
    {
        return $this->belongsToMany(User::class, 'enfant_parent', 'enfant_id', 'user_id');
    }

    // Un enfant a plusieurs personnes autorisées
    public function personnesAutorisees()
    {
        return $this->hasMany(PersonneAutorisee::class);
    }

    // Un enfant a plusieurs présences
    public function presences()
    {
        return $this->hasMany(Presence::class);
    }

    // Un enfant a plusieurs suivis journaliers
    public function suivisJournaliers()
    {
        return $this->hasMany(SuiviJournalier::class);
    }

    // Un enfant a plusieurs incidents
    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    // Un enfant a plusieurs factures
    public function factures()
    {
        return $this->hasMany(Facture::class);
    }
}
