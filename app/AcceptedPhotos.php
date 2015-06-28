<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AcceptedPhotos extends Model
{
    public $timestamps = false;
    protected $fillable = ['country', 'state_region', 'city', 'photo_data'];
}
