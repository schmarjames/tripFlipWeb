<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CategoryTagsOfPhotos extends Model
{
    public $timestamps = false;
    protected $fillable = ['photo_id', 'category_id'];
}
