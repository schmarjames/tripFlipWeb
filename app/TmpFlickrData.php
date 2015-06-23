<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TmpFlickrData extends Model
{
  public $table = 'tmp_flickr_data';
  protected $fillable = ['country', 'state_region', 'city', 'response_data'];
}
