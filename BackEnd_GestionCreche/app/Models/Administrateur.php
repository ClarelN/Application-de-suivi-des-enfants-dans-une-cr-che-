<?php

namespace App\Models;

class Administrateur extends Utilisateur
{
    protected $table = 'utilisateurs';

    protected static function booted(): void
    {
        static::addGlobalScope('role', fn($q) => $q->where('role', 'administrateur'));
        static::creating(fn($m) => $m->role = 'administrateur');
    }

    public function annonces()
    {
        return $this->hasMany(Annonce::class, 'user_id');
    }
}
