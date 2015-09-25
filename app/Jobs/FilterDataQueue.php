<?php

namespace App\Jobs;

use App\TmpFlickrData;
use App\AcceptedPhotos;
use App\RejectedPhotos;
use Carbon\Carbon;
use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;

class FilterDataQueue extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    protected $flickrEntryCount;
    protected $flickrEntries;
    protected $country;
    protected $state_region;
    protected $city;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($ids)
    {
        $this->flickrEntries = $ids;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach($ids as $id) {
          $entry = TmpFlickrData::where('id', '=', $id)->get();
          $this->_processPhotoCollection($entry);
        }
    }

    /*
     *	Delegate each collection of photos to be sorted
     *
     *  @return void
     */
   protected function _processPhotoCollection($entry) {
     foreach ($entry as $e) {
         $this->country      = $e->country;
         $this->state_region = $e->state_region;
         $this->city         = $e->city;

       //check each photo of this entry to see if its valid
       $this->_sortPhotoCollection(unserialize($e->response_data));
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
