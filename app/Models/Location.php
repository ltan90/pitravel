<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'locations';

    protected $fillable = ['name', 'lat', 'lng'];

    protected $primaryKey = 'id';

    public function hotel()
    {
        return $this->hasOne(Hotel::class);
    }
}
