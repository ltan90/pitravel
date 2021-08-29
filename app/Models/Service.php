<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'services';

    protected $fillable = [
        'name'
    ];

    /**
     * Get the service's file.
     */
    public function file()
    {
        return $this->morphOne(File::class, 'fileable');
    }
}
