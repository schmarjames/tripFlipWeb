<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    public $timestamps = false;
    public $table = 'gallery';
    protected $fillable = ['user_id', 'country_list'];
}
