<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Hotel extends Model
{
    use SoftDeletes, HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'hotels';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'price_min',
        'lat',
        'lng',
        'address',
        'location_id',
        'reviews',
        'description',
        'title',
        'content',
        'is_approved',
        'creator_id'
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'hotel_services', 'hotel_id', 'service_id');
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function files()
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function creatorUser()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function ($model) {
            if (Auth::check()) {
                $model->creator_id = Auth::id();
            }
        });
    }
}
