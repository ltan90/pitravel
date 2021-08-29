<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes, HasFactory;

    protected $table = 'customers';

    protected $primaryKey = 'id';

    protected $fillable = ['full_name', 'phone', 'email', 'address', 'passport', 'birthday', 'gender'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
