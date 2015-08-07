<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TemporaryPasswords extends Model
{
    protected $fillable = ['user_id', 'temporary_passwords'];
}
