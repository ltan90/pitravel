<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use SoftDeletes, HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'bookings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'hotel_id',
        'customer_id',
        'code',
        'arrival_date',
        'departure_date',
        'is_business',
        'adults',
        'children',
        'rooms',
        'note',
    ];

    /**
     * Get the hotel that owns the booking.
     */
    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    /**
     * Get the customer that owns the booking.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
