<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PhotoCategories extends Model
{
    public $timestamps = false;
    protected $fillable = ['photo_id', 'category_id'];

    public function photos() {
      return $this->belongsToMany('App\Tfphotos');
    }
}
