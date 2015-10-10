<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Likes;
use App\User;
use App\Tfphotos;
use App\ViewedPhotos;
use App\PhotoCategories;
use App\CategoryTagsOfPhotos;

class PhotoController extends Controller
{
  protected $weatherApiKey = "dc917ecc31f3df833231b3804d609fed";
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

    public function addLikes($id, $like) {

      // check user id
      $user = User::find($id);

      // Check if $likes is an array
      if (!is_null($user)) {
        if ($likes_arr = is_array($like)) {
          $likes_arr = unserialize($likes_arr);

          foreach ($likes_arr as $like) {
            dd($like);
            $currentLikeCount = Likes::where(["photo_id" => $like, "user_id" => $user->id])->get()->count();

            if ($currentLikeCount == 0) {
              Likes::create([
                'user_id' => $id,
                'photo_id' => $like
              ]);
            } else {
              Likes::where(["photo_id" => $like, "user_id" => $user->id])->delete();
            }

          }
          return response()->json(1);
        }

        $currentLikeCount = Likes::where(["photo_id" => $like, "user_id" => $user->id])
          ->get()
          ->count();

        if ($currentLikeCount == 0) {
          // Add like
          Likes::create([
            'user_id' => $id,
            'photo_id' => $like
          ]);
          return response()->json(1);
        }
        // Remove like
        else {
          Likes::where(["photo_id" => $like, "user_id" => $user->id])->delete();
          return response()->json(0);
        }

      }

      return response()->json(["error" => "Unauthorized users cannot use this functionality."]);
    }

    public function getCollection(Request $request) {
      $data = $request->only('amount', 'lastQueryId', 'latest', 'category');
      $user = \JWTAuth::parseToken()->authenticate();

      if (is_numeric($data['category'])) {
        $collection = $this->_getCategorySpecificPhotos($data);
      } else {
        // If adding more photos to feed
        if (is_numeric($data['lastQueryId']) && !(bool)$data['latest']) {
          $collection = Tfphotos::select('tfphotos.*', 'location_data.lat', 'location_data.long', 'countries.country', 'state_regions.state_region', 'cities.city', 'counties.county')
            ->join('location_data', 'tfphotos.location_id', '=', 'location_data.id')
            ->join('countries', 'tfphotos.country_id', '=', 'countries.id')
            ->leftJoin('state_regions', 'tfphotos.state_region_id', '=', 'state_regions.id')
            ->leftJoin('cities' , 'tfphotos.city_id', '=', 'cities.id')
            ->leftJoin('counties', 'tfphotos.county_id', '=', 'counties.id')
            ->where('tfphotos.id', '<', $data['lastQueryId'])
            ->take($data['amount'])
            ->orderBy('created_at', 'desc')
            ->get();
        }
        // If adding latest photos to feed
        else if (is_numeric($data['lastQueryId']) && (bool)$data['latest']) {
          $collection = Tfphotos::select('tfphotos.*', 'location_data.lat', 'location_data.long', 'countries.country', 'state_regions.state_region', 'cities.city', 'counties.county')
            ->join('location_data', 'tfphotos.location_id', '=', 'location_data.id')
            ->join('countries', 'tfphotos.country_id', '=', 'countries.id')
            ->leftJoin('state_regions', 'tfphotos.state_region_id', '=', 'state_regions.id')
            ->leftJoin('cities' , 'tfphotos.city_id', '=', 'cities.id')
            ->leftJoin('counties', 'tfphotos.county_id', '=', 'counties.id')
            ->where('tfphotos.id', '>', $data['lastQueryId'])
            ->orderBy('created_at', 'asc')
            ->get();
        }

        // If initial query for feed
        else {
            $collection = Tfphotos::select('tfphotos.*', 'location_data.lat', 'location_data.long', 'countries.country', 'state_regions.state_region', 'cities.city', 'counties.county')
              ->join('location_data', 'tfphotos.location_id', '=', 'location_data.id')
              ->join('countries', 'tfphotos.country_id', '=', 'countries.id')
              ->leftJoin('state_regions', 'tfphotos.state_region_id', '=', 'state_regions.id')
              ->leftJoin('cities' , 'tfphotos.city_id', '=', 'cities.id')
              ->leftJoin('counties', 'tfphotos.county_id', '=', 'counties.id')
              ->take($data['amount'])
              ->orderBy('created_at', 'desc')
              ->get();
        }
      }

      // include the likes and weather data foreach photo
      $collection = $collection->map(function($photo, $v) use ($user) {
        $photoLikedTotal = Likes::where("photo_id", $photo->id)->select("user_id")->get()->count();
        $userLiked = Likes::where(["photo_id" => $photo->id, "user_id" => $user->id])->select("user_id")->get();

        $photo['likes'] = $photoLikedTotal;
        $photo['likedByUser'] = ($userLiked->count() > 0 ? true : false);
        $photo["weatherCondition"] = $this->getWeatherData($photo["lat"], $photo["long"])["weather"][0]["description"];

        return $photo;
      });
      // return collection of photos and last photos id
      return response()->json($collection);
    }

    private function _getCategorySpecificPhotos($data) {
      // If adding more photos to feed
      if (is_numeric($data['lastQueryId']) && !(bool)$data['latest']) {
        $collection = Tfphotos::select('tfphotos.*', 'location_data.lat', 'location_data.long', 'countries.country', 'state_regions.state_region', 'cities.city', 'counties.county')
          ->join('location_data', 'tfphotos.location_id', '=', 'location_data.id')
          ->join('countries', 'tfphotos.country_id', '=', 'countries.id')
          ->leftJoin('state_regions', 'tfphotos.state_region_id', '=', 'state_regions.id')
          ->leftJoin('cities' , 'tfphotos.city_id', '=', 'cities.id')
          ->leftJoin('counties', 'tfphotos.county_id', '=', 'counties.id')
          ->whereIn('tfphotos.id', function($query) use($data) {
            $query
              ->from('category_tags_of_photos')
              ->selectRaw('photo_id')
              ->where('category_id', '=', $data['category']);
          })
          ->where('tfphotos.id', '<', $data['lastQueryId'])
          ->take($data['amount'])
          ->orderBy('created_at', 'desc')
          ->get();
      }
      // If adding latest photos to feed
      else if (is_numeric($data['lastQueryId']) && (bool)$data['latest']) {
        $collection = Tfphotos::select('tfphotos.*', 'location_data.lat', 'location_data.long', 'countries.country', 'state_regions.state_region', 'cities.city', 'counties.county')
          ->join('location_data', 'tfphotos.location_id', '=', 'location_data.id')
          ->join('countries', 'tfphotos.country_id', '=', 'countries.id')
          ->leftJoin('state_regions', 'tfphotos.state_region_id', '=', 'state_regions.id')
          ->leftJoin('cities' , 'tfphotos.city_id', '=', 'cities.id')
          ->leftJoin('counties', 'tfphotos.county_id', '=', 'counties.id')
          ->whereIn('tfphotos.id', function($query) use($data) {
            $query
              ->from('category_tags_of_photos')
              ->selectRaw('photo_id')
              ->where('category_id', '=', $data['category']);
          })
          ->where('tfphotos.id', '>', $data['lastQueryId'])
          ->orderBy('created_at', 'asc')
          ->get();
      }
      // If initial query for feed
      else {
        $collection = Tfphotos::select('tfphotos.*', 'location_data.lat', 'location_data.long', 'countries.country', 'state_regions.state_region', 'cities.city', 'counties.county')
          ->join('location_data', 'tfphotos.location_id', '=', 'location_data.id')
          ->join('countries', 'tfphotos.country_id', '=', 'countries.id')
          ->leftJoin('state_regions', 'tfphotos.state_region_id', '=', 'state_regions.id')
          ->leftJoin('cities' , 'tfphotos.city_id', '=', 'cities.id')
          ->leftJoin('counties', 'tfphotos.county_id', '=', 'counties.id')
          ->whereIn('tfphotos.id', function($query) use($data) {
              $query
                ->from('category_tags_of_photos')
                ->selectRaw('photo_id')
                ->where('category_id', '=', $data['category']);
          })
          ->take($data['amount'])
          ->orderBy('created_at', 'desc')
          ->get();
      }
      return $collection;
    }

    public function getcategoryphotos(Request $request) {
      $categories = PhotoCategories::all()
        ->map(function($category) {
           return Tfphotos::select('url')
            ->where('id', function($query) use($category) {
              $query
                ->from('category_tags_of_photos')
                ->selectRaw('photo_id')
                ->where('category_id', '=', $category->id)
                ->take(1)
                ->orderBy(\DB::raw('random()'));
            })
            ->orderBy(\DB::raw('random()'))
            ->first()
            ->merge(['category_id' => $category->id]);
        });

        return response()->json($categories);
    }

    public function getRandomCollection(Request $request) {
      $data = \Input::all();

      $userId = $data["userId"];
      $viewedPhotos = $data["viewedPhotos"];
      // Add view photos to database
      if (count($viewedPhotos) > 0) {
          $this->_storeUsersViewedPhotoIds($userId, $viewedPhotos);
      }

      $viewed = array_column($this->_getUsersViewedPhotoIds($userId)->toArray(), "photo_id");
      $randoms = Tfphotos::select('id', 'url')
        ->whereNotIn("id", function($query) use($userId) {
          $query->from('likes')
            ->selectRaw('photo_id')
            ->where('user_id', '=', $userId);
        })
        ->whereNotIn("id", $viewed)
        ->orderBy(\DB::raw('random()'))
        ->take(20)
        ->get();

      return response()->json($randoms);
    }



    private function _storeUsersViewedPhotoIds($userId, $photos) {
      foreach($photos as $photoId) {
        ViewedPhotos::updateOrCreate(["user_id" => $userId, "photo_id" => $photoId]);
      }
    }

    private function _getUsersViewedPhotoIds($userId) {
      return ViewedPhotos::where("user_id", $userId)->select(["photo_id"])->get();
    }

    private function _removeUsersViewedPhotoRecord() {

    }

    public function getUpdatePhotoFeedCount(Request $request) {
      $data = $request->only('lastQueryId');

      if (!is_numeric($data['lastQueryId']) || is_null($data['lastQueryId'])) { return response()->json(["message" => "Invalid id was given."]); }
      $total = Tfphotos::where('id', '>', $data['lastQueryId'])
        ->orderBy('created_at', 'asc')
        ->get()
        ->count();

      return response()->json($total);
    }

    public function getWeatherData($lat, $long) {
      //api.openweathermap.org/data/2.5/weather?lat=" + this.state.lat + "&lon=" + this.state.long + "&APPID=dc917ecc31f3df833231b3804d609fed"
      $url = sprintf(
        "api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&APPID=%s",
        $lat,
        $long,
        $this->weatherApiKey
      );

      $client = new \GuzzleHttp\Client();
      $response = $client->get($url);

      if ($response->getStatusCode() == 200) {
          $res_data = $response->getBody()->getContents();
          return json_decode($res_data, true);
      }
      return false;
    }
}
