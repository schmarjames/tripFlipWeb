<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RejectedPhotos;
use App\AcceptedPhotos;
use App\Countries;
use App\StateRegions;
use App\Cities;
use App\County;
use App\LocationData;
use App\PhotoCategories;
use App\Tfphotos;

class AcceptsController extends Controller
{

          /*
            array(9) {
              ["id"]=>
              string(11) "17964739932"
              ["owner"]=>
              string(12) "24147900@N06"
              ["secret"]=>
              string(10) "399b3dc43f"
              ["server"]=>
              string(4) "5331"
              ["farm"]=>
              int(6)
              ["title"]=>
              string(36) "Port of Barcelona, Barcelona, Spain."
              ["ispublic"]=>
              int(1)
              ["isfriend"]=>
              int(0)
              ["isfamily"]=>
              int(0)
            }
          */

  protected $base_url = 'https://api.flickr.com/services/rest/?method=';
  protected $geo_method = 'flickr.photos.geo.getLocation';
  protected $info_method = 'flickr.photos.getInfo';
  protected $format = 'json';
  protected $nojsoncallback = 1;
  protected $message = [
    "error" => [
      "store" => "There was an issue with approving the photo",
      "transfer" => "Photo could not be transferred to the rejected table",
      "delete" => "Photo could not be deleted",
      "noTags" => "Unfortunately this photo didn't have any of the required tags for this application"
    ],
    "success" => [
      "store" => "Photo was successfully approved",
      "transfer" => "Photo was successfully moved to the rejected table",
      "delete" => "Photo is now deleted"
      ]
  ];

  protected $categories;
  protected $matchingCategoriesId = [];

  protected $base_url = 'https://api.flickr.com/services/rest/?method=';
  protected $method = 'flickr.photos.getInfo';
  protected $format = 'json';
  protected $nojsoncallback = 1;

    public function __construct() {
        \Config::set('auth.model', 'App\AdminUsers');
        $this->middleware('jwt.auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $acceptedPhotos = AcceptedPhotos::all();
        return response()->json($acceptedPhotos);
    }

    public function queryPhotos($amount, $lastQueryId) {
      $accepteddPhotos;
      if (is_numeric($lastQueryId)) {
        $accepteddPhotos = AcceptedPhotos::select('*')
          ->where('id', '<', $lastQueryId)
          ->take($amount)
          ->orderBy('id', 'desc')
          ->get();
      } else {
        $accepteddPhotos = AcceptedPhotos::select('*')
          ->take($amount)
          ->orderBy('id', 'desc')
          ->get();
      }

      return response()->json($accepteddPhotos);
    }

    /**
     * Pass data unique id to the _approvePhoto method for approval
     *
     * @return Response
     */
    public function store($id)
    {
      return response()->json($this->_approvePhoto($id));
    }

    /**
     * Moves photo to reject table.
     *
     * @param  int  $id
     * @return Response
     */
    public function transfer($id)
    {
        if(!is_numeric($id)) return $this->message["error"]["transfer"];
        $photo = AcceptedPhotos::find($id);

        // Insert photo data in table
        $reject = RejectedPhotos::create([
          'country' => $photo->country,
          'state_region' => $photo->state_region,
          'city' => $photo->city,
          'photo_data' => $photo->photo_data
        ]);

        if(is_null($reject)) {
          return $this->message["error"]["transfer"];
        }

        // Delete entry from accepted table
        $photo->delete();
        return $this->message["success"]["transfer"];
    }

    /**
     * Transfers photo and its data to maiin photo table.
     *
     * @param  int  $id, string $table
     * @return Response
     */
    protected function _approvePhoto($id)
    {
      $photo;
      $geo;
      $tfphoto;

      if(!is_numeric($id)) return $this->message["error"]["store"];
      $photo = AcceptedPhotos::find($id);
      $photo_data = json_decode($photo->photo_data);

      // older photos during development may not have tags
      if (!property_exists($photo_data, "tags")) {
        $this->categories = PhotoCategories::all()->toArray();
        if ($this->_checkPhotoTags($this->_photoGetInfoUrl($photo_data->id))) {
            $photo_data["tags"] = $this->matchingCategoriesId;
        } else {
            AcceptedPhotos::where('id', $photo->id)->delete();
            return $this->message["error"]["noTags"];
        }
      }

      // Get Geo Lat Long Data
      $geo = $this->_getGeoData($photo_data->id);
      $author = $this->_getMetaData($photo_data->id);

      $tfphoto = new Tfphotos;
      $tfphoto = $this->_storeLocationData($geo, $tfphoto);
      $tfphoto->url = $this->_generateFlickrUrl($photo_data);
      $tfphoto->author = $author;
      $tfphoto->save();

      if(is_null($tfphoto->id)) {
        return $this->message["error"]["store"];
      }

      // Store photo tags
      $this->_storePhotoCategories($tfphoto->id, $photo_data->tags);

      // delete $id's row from accepted table
      AcceptedPhotos::find($id)->delete();
      return $this->message["success"]["store"];
    }

    protected function _checkPhotoTags($url) {
      $response = $this->_sendRequest($url);
      $this->matchingCategoriesId = [];

      if($response->getStatusCode() == 200) {
        $res_data = $response->getBody()->getContents();
        $res_arr = json_decode($res_data, true);
        if (array_key_exists('photo', $res_arr)) {
          if (count($res_arr["photo"]["tags"]) > 0) {
              $tags = array_column($res_arr["photo"]["tags"]["tag"], "_content");
              foreach($this->categories as $category) {
                if (in_array($category["category"], $tags)) {
                  array_push($this->matchingCategoriesId, $category["id"]);
                }
              }
              return (count($this->matchingCategoriesId) > 0) ? true : false;
          }
        }
       return false;
      }
    }

    protected function _sendRequest($url) {
      $client = new \GuzzleHttp\Client();
      return $client->get($url);
    }

    protected function _photoGetInfoUrl($id) {
      return sprintf('%s%s&api_key=%s&photo_id=%s&format=%s&nojsoncallback=%d',
        $this->base_url,
        $this->method,
        \Config::get('constants.FLICKR_API'),
        $id,
        $this->format,
        $this->nojsoncallback
      );
    }

    protected function _storePhotoCategories($photo_id, $tags) {
      $tags = array_unique($tags);
      foreach($tags as $tag_id) {
          PhotoCategories::create([
              'photo_id' => $photo_id,
              'category_id' => $tag_id
            ]);
      }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
      if(!is_numeric($id)) return $this->message["error"]["delete"];
      $photo = AccpetedPhotos::find($id);

      return $photo->delete();
    }

    /**
     * Store location in respected tables if they don't yet exist.
     *
     * @param  string  $data, $tf
     * @return Object
     */
    protected function _storeLocationData($data, $tf)
    {
      $location = $data["photo"]["location"];
      $country = $location["country"]["_content"];
      $state_region = $location["region"]["_content"];
      $city = $location["locality"]["_content"];
      $county = $location["county"]["_content"];

      // Store location data
      if(Countries::where('country', $country)->count() == 0) {
        $tf->country_id = Countries::create([ 'country' => $country ]);
      } else {
        $tf->country_id = Countries::where('country', $country)->first()->id;
      }

      if(StateRegions::where('state_region', $state_region)->count() == 0) {
        $tf->state_region_id = StateRegions::create([ 'state_region' => $state_region ]);
      } else {
        $tf->state_region_id = StateRegions::where('state_region', $state_region)->first()->id;
      }

      if(Cities::where('city', $city)->count() == 0) {
        $tf->city_id = Cities::create([ 'city' => $city ]);
      } else {
        $tf->city_id = Cities::where('city', $city)->first()->id;
      }

      if(County::where('county', $county)->count() == 0) {
        $tf->county_id = County::create(['county' => $county ]);
      } else {
        $tf->county_id = County::where('county', $county)->first()->id;
      }

      // Store geo data
      $tf->location_id = LocationData::create([
        'lat' => $location["latitude"],
        'long' => $location["longitude"],
        'accuracy' => $location["accuracy"]
        ])->id;
      return $tf;
    }

    /**
     * Prepare flickr photo url.
     *
     * @param  $data
     * @return string
     */
    protected function _generateFlickrUrl($data)
    {
      return sprintf('https://farm%s.staticflickr.com/%d/%d_%s.jpg',
              $data->farm,
              $data->server,
              $data->id,
              $data->secret
          );
    }

    /**
     * Runs request to flickrs api for photos location data.
     *
     * @param  $id
     * @return Array
     */
    protected function _getGeoData($id)
    {
      $url = sprintf(
        '%s%s&api_key=%s&photo_id=%s&format=%s&nojsoncallback=%d',
        $this->base_url,
        $this->geo_method,
        \Config::get('constants.FLICKR_API'),
        $id,
        $this->format,
        $this->nojsoncallback
      );
      $client = new \GuzzleHttp\Client();
      $response = $client->get($url);

      if($response->getStatusCode() == 200) {
        $res_data = $response->getBody()->getContents();
        return json_decode($res_data, true);
      }
      return false;
    }

  /**
   * Runs request to flickrs api for photos author and miscelaneous data.
   *
   * @param  $id
   * @return String
   */
  protected function _getMetaData($id)
  {
    $url = sprintf(
      '%s%s&api_key=%s&photo_id=%s&format=%s&nojsoncallback=%d',
      $this->base_url,
      $this->info_method,
      \Config::get('constants.FLICKR_API'),
      $id,
      $this->format,
      $this->nojsoncallback
    );
    $client = new \GuzzleHttp\Client();
    $response = $client->get($url);

    if($response->getStatusCode() == 200) {
      $res_data = $response->getBody()->getContents();
      $data = json_decode($res_data, true);
      return ($data['photo']['owner']['realname'] !== "") ?
        $data['photo']['owner']['realname'] :
        $data['photo']['owner']['username'];
    }
  }

}
