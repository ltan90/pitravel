<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $table = 'rooms';

    protected $primaryKey = 'id';

    protected $fillable = ['hotel_id', 'name', 'bed_type', 'personal'];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function scopeHotelId($query, string $id)
    {
        return $query->where('hotel_id', $id);
    }
}
