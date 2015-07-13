<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cities extends Model
{
    public $timestamps = false;
    protected $fillable = ['city'];
}
