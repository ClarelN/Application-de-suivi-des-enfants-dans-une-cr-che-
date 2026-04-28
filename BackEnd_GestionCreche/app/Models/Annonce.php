<?php

namespace App\Models;

use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Annonce extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'titre',
        'corps',
        'cible',
        'expire_le',
    ];

    protected $casts = [
        'expire_le' => 'datetime',
    ];

    public function auteur()
    {
        return $this->belongsTo(Utilisateur::class, 'user_id');
    }
}
