<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;

    protected $table = "provinces";

    protected $primaryKey = "id";

    protected $fillable = ["name, type"];

    public function hotel()
    {
        return $this->hasMany(Hotel::class);
    }
}
