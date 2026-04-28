<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'utilisateurs';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
        'actif',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'actif' => 'boolean',
    ];

    public function annonces()
    {
        return $this->hasMany(Annonce::class, 'user_id');
    }

    public function messagesEnvoyes()
    {
        return $this->hasMany(Message::class, 'expediteur_id');
    }

    public function messagesRecus()
    {
        return $this->hasMany(Message::class, 'destinataire_id');
    }

    public function enfants()
    {
        return $this->belongsToMany(Enfant::class, 'enfant_parent', 'parent_id', 'enfant_id')
                    ->withPivot('lien_parente', 'responsable_principal')
                    ->withTimestamps();
    }

    public function groupes()
    {
        return $this->belongsToMany(Groupe::class, 'educateur_groupe', 'educateur_id', 'groupe_id');
    }
}
