<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\AcceptedPhotos;
use App\Countries;
use App\StateRegions;
use App\Cities;

class AcceptsController extends Controller
{

  protected $base_url = 'https://api.flickr.com/services/rest/?method=';
  protected $method = 'flickr.photos.geo.getLocation';
  protected $format = 'json';
  protected $nojsoncallback = 1;

    public function __construct() {
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

        return $acceptedPhotos;
    }

    /**
     * Pass data unique id to the _approvePhoto method for approval
     *
     * @return Response
     */
    public function store($id)
    {
      return $this->_approvePhoto($id);
    }

    /**
     * Moves photo to reject table.
     *
     * @param  int  $id, string $table
     * @return Response
     */
    public function transfer($id, $table)
    {
        $photo = AcceptedPhotos::find($id);
        var_dump(unserialize($photo->photo_data)); die();

        // Insert photo data in table
        Rejected::create([
          'country' => $photo->country,
          'state_region' => $photo->state_region,
          'city' => $photo->city,
          'photo_data' => $photo->photo_data
        ]);

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

        // Delete entry from accepted table
        return $photo->delete();
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
      $url;
      $geo;
      $tfphoto;

      $photo = AcceptedPhotos::find($id);
      $photo_data = unserialize($photo->photo_data);

      $this->_searchAndStoreLocationData($photo->country, $photo->state_region, $photo->city);
      $url = $this->_generateFlickrUrl($photo_data);

      // Get Geo Lat Long Data
      $geo = $this->_getGeoData($photo_data["id"]);

      // Insert photo data in table
      $tfphoto = Tfphotos::create([
        'geo' => "",
        'country_id' => Countries::where('country', $location->country)->get()->country,
        'state_region_id' => StateRegions::where('state_region', $location->state_region)->get()->state_region,
        'city_id' => Cities::where('city', $location->city)->get()->city,
        'flickr_url' => $url
      ]);

      return ($tfphoto) ? true : false;
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
      $photo = AccpetedPhotos::find($id);

      return $photo->delete();
    }

    /**
     * Store location in respected tables if they don't yet exist.
     *
     * @param  string  $country, $state_region, $city
     * @return Void
     */
    protected function _searchAndStoreLocationData($country, $state_region, $city)
    {
      if(Countries::where('country', $country)->count() == 0) {
        Countries::create([ 'country' => $country ]);
      }

      if(!is_null($state_region)) {
        if(StateRegions::where('state_region', $state_region)->count() == 0) {
          StateRegions::create([ 'state-region' => $state_region ]);
        }
      }

      if(!is_null($city)) {
        if(Cities::where('city', $city)->count() == 0) {
          Cities::create([ 'city' => $city ]);
        }
      }
    }

    protected function _generateFlickrUrl($data)
    {
      return sprintf('https://farm%s.staticflickr.com/%d/%d_%s.jpg',
              $data['farm'],
              $data['server'],
              $data['id'],
              $data['secret']
          );
    }

    protected function _getGeoData($id)
    {
      $url = sprintf(
        '%s%s&api_key=%s&photo_id=%sformat=%s&nojsoncallback=%d',
        $this->base_url,
        $this->method,
        \Config::get('constants.FLICKR_API'),
        $id,
        $this->format,
        $this->nojsoncallback
      );

      $client = new \GuzzleHttp\Client();
      return $client->get($url);
    }
}
