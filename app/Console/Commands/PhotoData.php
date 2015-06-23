<?php

namespace App\Console\Commands;

class PhotoData {
    //Key: 8f7b89ad0400ac3446579611693c61f6
    //Secret: c7aae4aa87991188

    //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
    //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)

    // ex:
    // https://api.flickr.com/services/rest/?method=flickr.photos.search
    // &api_key=6fcd9a3cf8a8a260b36df54274e6b5bc
    // &tags=istanbul+turkey
    // &has_geo=1
    // &format=json
    // &nojsoncallback=1
    // &auth_token=72157654426507979-df80e6b75efd729c
    // &api_sig=68b585b85f149a3fd2ae9b5dd61d8341

    protected $flickr_api_key = FLICKR_API;
    protected $base_url = 'https://api.flickr.com/services/rest/?method=';
    protected $method = 'flickr.photos.search';
    protected $tags;
    protected $has_geo = 1;
    protected $page;
    protected $format = 'json';
    protected $nojsoncallback = 1;

    static function queryPhotos() {
        // get all locations from location query table


        $client = new \GuzzleHttp\Client();


    }

$client = new \GuzzleHttp\Client();

$apikey = '8f7b89ad0400ac3446579611693c61f6';
$search_string = 'istanbul';
$url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' .$apikey . '&tags=' . $search_string . '&has_geo=1&page=5000&format=json&nojsoncallback=1';

$response = $client
->get($url)
->getBody()
->getContents();

dd($response);
}
