<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Likes;
use App\User;
use App\Tfphotos;

class PhotoController extends Controller
{
  protected $message = [
    "error" => [
      "get_likes" => "Sorry, unable to get the list of people who've liked this photo",
      "get_country_photos" => "Sorry, unable to get the countries photos"
    ]
  ];

  public function __construct() {
      \Config::set('auth.model', 'App\User');
      $this->middleware('jwt.auth');
  }

    public function getSpecificLikes($photo_id) {
      if (!is_numeric($id) || is_null($id)) return response()->json($this->message["error"]["get_likes"]);

      $users = Likes::where('photo_id', $photo_id)->select('user_id')->get()->toArray();
      $likeArr = User::find($user)->select(array('id', 'name', 'profile_pic'))->get();
      return response()->json($likeArr);
    }

    public function addViews($arr) {
      $photosArr = unserialize($arr);

      if (count($photosArr) > 0) {
        foreach($photosArr as $photo_id) {
          $photo = Tfphotos::find($photo_id);
          $photo->view = $photo->view + 1;
          $photo->save();
        }
        return true;
      }
      return false;
    }

    public function addLikes($id, $arr) {
      $photosArr = unserialize($arr);
      if(is_numeric($id) && count($arr) > 0) {
        foreach($photoArr as $photo_id) {
          Like::create([
            "user_id"  => $id,
            "photo_id" => $photo_id
          ]);
        }
        return true;
      }
      return false;
    }

    public function getCollection(Request $request) {
      $data = $request->only('amount', 'latestPhoto', 'latest');
      // check if this query is for previous or latest posted photos
      if((bool)$data['latest']) {
        return response()->json();
      }

      // query photos with a limit equal to requested amount
      $collection = \DB::table('tfphotos')
        ->join('location_data', 'tfphotos.location_id', '=', 'location_data.id')
        ->join('countries', 'tfphotos.country_id', '=', 'countries.id')
        ->leftJoin('state_regions', 'tfphotos.state_region_id', '=', 'state_regions.id')
        ->leftJoin('cities' , 'tfphotos.city_id', '=', 'cities.id')
        ->leftJoin('counties', 'tfphotos.county_id', '=', 'counties.id')
        ->take($data['amount'])
        ->orderBy('created_at', 'desc')
        ->get();

      // return collection of photos and last photos id
      return response()->json($collection);
    }
}
