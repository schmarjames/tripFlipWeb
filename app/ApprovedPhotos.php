<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ApprovedPhotos extends Model
{
    protected $fillable = ['admin_user_id', 'photo_id'];
}
