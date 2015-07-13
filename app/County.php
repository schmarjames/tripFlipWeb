<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class County extends Model
{
  public $timestamps = false;
  protected $fillable = ['county'];
}
