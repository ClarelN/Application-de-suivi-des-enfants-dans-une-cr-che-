<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;
    protected $fillable = [
        'enfant_id',
        'date',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function setDateAttribute(mixed $value): void
    {
        $this->attributes['date'] = \Carbon\Carbon::parse($value)->format('Y-m-d');
    }

    // Une présence appartient à un enfant
    public function enfant()
    {
        return $this->belongsTo(Enfant::class);
    }
}
