<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Annonce extends Model
{
    use SoftDeletes;

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
        return $this->belongsTo(User::class, 'user_id');
    }
}
