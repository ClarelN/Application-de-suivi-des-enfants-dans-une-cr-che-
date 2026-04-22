<?php

namespace App\Models;

class ParentModel extends Utilisateur
{
    protected $table = 'utilisateurs';

    protected static function booted(): void
    {
        static::addGlobalScope('role', fn($q) => $q->where('role', 'parent'));
        static::creating(fn($m) => $m->role = 'parent');
    }

    public function enfants()
    {
        return $this->belongsToMany(Enfant::class, 'enfant_parent', 'parent_id', 'enfant_id')
                    ->withPivot('lien_parente', 'responsable_principal');
    }

    public function factures()
    {
        return $this->hasMany(Facture::class, 'parent_id');
    }
}
