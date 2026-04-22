<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'enfant_id',
        'date',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Une présence appartient à un enfant
    public function enfant()
    {
        return $this->belongsTo(Enfant::class);
    }
}
