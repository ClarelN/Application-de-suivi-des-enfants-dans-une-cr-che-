<?php

namespace App\Models;

use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $fillable = [
        'expediteur_id',
        'destinataire_id',
        'sujet',
        'corps',
        'lu',
    ];

    public function expediteur()
    {
        return $this->belongsTo(Utilisateur::class, 'expediteur_id');
    }

    public function destinataire()
    {
        return $this->belongsTo(Utilisateur::class, 'destinataire_id');
    }

    public function marquerLu()
    {
        $this->update(['lu' => true]);
    }
}
