<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'type_repas',
        'plat_principal',
        'accompagnement',
        'dessert',
        'allergenes',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
