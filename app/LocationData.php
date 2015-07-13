<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LocationData extends Model
{
    public $timestamps = false;
    public $table = 'location_data';
    protected $fillable = ['lat', 'long', 'accuracy'];
}
