<?php

namespace App\Models;

class Educateur extends Utilisateur
{
    protected $table = 'utilisateurs';

    protected static function booted(): void
    {
        static::addGlobalScope('role', fn($q) => $q->where('role', 'educateur'));
        static::creating(fn($m) => $m->role = 'educateur');
    }

    public function groupes()
    {
        return $this->belongsToMany(Groupe::class, 'educateur_groupe', 'educateur_id', 'groupe_id');
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'educateur_id');
    }

    public function suivisJournaliers()
    {
        return $this->hasMany(SuiviJournalier::class, 'educateur_id');
    }
}
