<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PhotoCategories extends Model
{
    public $timestamps = false;

    public function photos() {
      return $this->belongsToMany('App\Tfphotos');
    }
}
