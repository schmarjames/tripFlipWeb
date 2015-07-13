<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Countries extends Model
{
    public $timestamps = false;
    protected $fillable = ['country'];
}
