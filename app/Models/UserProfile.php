<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'user_profiles';

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'firstname',
        'lastname',
        'avatar',
        'phone',
        'gender',
        'address'
    ];
}
