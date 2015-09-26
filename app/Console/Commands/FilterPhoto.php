<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\TmpFlickrData;
use App\AcceptedPhotos;
use App\RejectedPhotos;
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
        foreach ($this->flickrEntries as $flickrEntry) {
            $this->country      = $flickrEntry->country;
            $this->state_region = $flickrEntry->state_region;
            $this->city         = $flickrEntry->city;

          //check each photo of this entry to see if its valid
          $this->_sortPhotoCollection(unserialize($flickrEntry->response_data));
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
   }

   /*
    *	Scans image to see if it is valid
    *	Face Detection
    *
    *  @return bool
    */
   protected function _filterPhoto($url) {
       // pass url to python script
       return (bool)exec("python scanPhoto.py $url");
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
