<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tfphotos extends Model
{
    public $timestamps = false;
    protected $fillable = ['location_id', 'country_id', 'state_region_id', 'city_id', 'county_id', 'url'];
}
