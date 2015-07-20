<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Likes;
use App\Users;

class PhotoController extends Controller
{
  protected $message = [
    "error" => [
      "get_likes" => "Sorry, unable to get the list of people who've liked this photo",
      "get_country_photos" => "Sorry, unable to get the countries photos"
    ]
  ];

    public function getSpecificLikes($photo_id) {
      if (!is_numeric($id) || is_null($id)) return response()->json($this->message["error"]["get_likes"]);

      $users = Like::where('photo_id', $photo_id)->get('user_id')->toArray();
      $likeArr = Uses::find($user)->select(array('id', 'name', 'profile_pic'));


      return response()->json($likeArr);
    }
}
