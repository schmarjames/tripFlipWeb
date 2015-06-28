<?php

namespace App\Console\Commands;

use DB;
use App\TmpFlickrData;
use App\LocationQuery;

class PhotoData {
    protected $base_url = 'https://api.flickr.com/services/rest/?method=';
    protected $method = 'flickr.photos.search';
    protected $search_string;
    protected $has_geo = 1;
    protected $page;
    protected $format = 'json';
    protected $nojsoncallback = 1;


    public function queryPhotos() { $this->_prepareRequest(); }

    protected function _prepareRequest() {
      // get all locations from location query table
      $locations = LocationQuery::all();

      foreach ($locations as $location) {
        if($location->total_pages == 0 || !($location->current_page == $location->total_pages)) {
          $this->search_string = "";

          // Make tag string
          if($location->country == "united states") {
            $this->search_string = $location->state_region;
          } else {
            $this->search_string = $location->country;
          }

          if(!is_null($location->city)) {
            $cities = explode(",", $location->city);

            foreach($cities as $city) {
                // query by each city
                $this->search_string = $city . $this->search_string;
                $url = $this->_generateUrl();
                $response = $this->_sendRequest($url);

                // Check the response
                if($response->getStatusCode() == 200) {
                  $res_data = $response->getBody()->getContents();
                  $res_arr = json_decode($res_data, true);

                  // update page amount and current page number for location entry
                  $next_page = $location->current_page + 1;
                  $res_total_pages = $res_arr["photos"]["pages"];
                  $page_amount = ($location->total_pages < $res_total_pages) ? $res_total_pages : $location->total_pages;

                  // Update location query data
                  $current_location = LocationQuery::find($location->id);
                  $current_location->current_page = $next_page;
                  $current_location->total_pages = $page_amount;
                  $current_location->save();

                  // Insert flickr json data in tmp table for specific location
                  TmpFlickrData::create([
                    'country' => $location->country,
                    'state_region' => $location->state_region,
                    'city' => $location->city,
                    'response_data' => serialize($res_arr["photos"]["photo"])
                  ]);
                }
            }
          }
        }
      }
    }

    protected function _generateUrl() {
      return sprintf('%s%s&api_key=%s&tags=%s&has_geo=%d&page=%d&format=%s&nojsoncallback=%d',
        $this->base_url,
        $this->method,
        \Config::get('constants.FLICKR_API'),
        $this->search_string,
        $this->has_geo,
        $this->page,
        $this->format,
        $this->nojsoncallback
      );
    }

    protected function _sendRequest($url) {
      $client = new \GuzzleHttp\Client();
      return $client->get($url);
    }
}
