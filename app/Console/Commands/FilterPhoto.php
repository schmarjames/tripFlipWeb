<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\TmpFlickrData;
use App\AcceptedPhotos;
use App\RejectedPhotos;
use App\PhotoCategories;
use Carbon\Carbon;

class FilterPhoto extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'filter:photo';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Filter images with people or text in the tmp_flickr_data table.';

    protected $flickrEntryCount;
    protected $flickrEntries;
    protected $country;
    protected $state_region;
    protected $city;
    protected $matchingCategoriesId = [];

    protected $base_url = 'https://api.flickr.com/services/rest/?method=';
    protected $method = 'flickr.photos.getInfo';
    protected $format = 'json';
    protected $nojsoncallback = 1;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->flickrEntries = TmpFlickrData::where('created_at', '<=', Carbon::now())->get();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if ($this->flickrEntries->count() > 0) {
          foreach ($this->flickrEntries as $flickrEntry) {
              $this->id           = $flickrEntry->id;
              $this->country      = $flickrEntry->country;
              $this->state_region = $flickrEntry->state_region;
              $this->city         = $flickrEntry->city;

            //check each photo of this entry to see if its valid
            $this->_sortPhotoCollection(unserialize($flickrEntry->response_data));
          }
        }
    }

    /*
     *	Place each photo entry in its appropriate table
     *   based on its acceptance
     *
     *  @return void
     */
   protected function _sortPhotoCollection($photoArrs) {
     foreach($photoArrs as $photoArr) {
         $result;
         $this->matchingCategoriesId = [];

         // check photo tags
         $hasTags = $this->_checkPhotoTags($this->_photoGetInfoUrl($photoArr["id"]));

         if ($hasTags) {

           // store photos categories / tags
           $photoArr['tags'] = $this->matchingCategoriesId;

           // pass flickr url of photo to filter method
           $result = $this->_filterPhoto($this->_photoUrl($photoArr));

           // if photo is valid
           // store in accepted table
           if($result) {
               AcceptedPhotos::create([
                   'country' => $this->country,
                   'state_region' => $this->state_region,
                   'city' => $this->city,
                   'photo_data' => json_encode($photoArr)
               ]);
           } else {
               RejectedPhotos::create([
                   'country' => $this->country,
                   'state_region' => $this->state_region,
                   'city' => $this->city,
                   'photo_data' => json_encode($photoArr)
               ]);
           }
         }

         // delete photo data because it does have the match categories we want
         TmpFlickrData::where('id', $this->id)->delete();
     }
   }

   protected function _checkPhotoTags($url) {
     $response = $this->_sendRequest($url);

     if($response->getStatusCode() == 200) {
       $res_data = $response->getBody()->getContents();
       $res_arr = json_decode($res_data, true);
       if (array_key_exists('photo', $res_arr)) {
         if (count($res_arr["photo"]["tags"]) > 0) {
             $categories = PhotoCategories::all()->toArray();

             $tags = array_column($res_arr["photo"]["tags"]["tag"], "_content");
             foreach($categories as $category) {
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

   /*
    *	Scans image to see if it is valid
    *	Face Detection
    *
    *  @return bool
    */
   protected function _filterPhoto($url) {
       // pass url to python script
       return (bool)exec("python /home/forge/default/public/scanPhoto.py $url");
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

   protected function _sendRequest($url) {
     $client = new \GuzzleHttp\Client();
     return $client->get($url);
   }

     /*
      *	Generate photo url
      *
      *  @return string
      */
   protected function _photoUrl($data) {
     return sprintf('https://farm%s.staticflickr.com/%d/%d_%s.jpg',
             $data['farm'],
             $data['server'],
             $data['id'],
             $data['secret']
         );
   }
}
