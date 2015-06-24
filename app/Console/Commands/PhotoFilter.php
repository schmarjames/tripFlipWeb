<?php

namespace App\Console\Commands;

use App\TmpFlickrData;
use Carbon\Carbon;


class PhotoFilter {

  protected $flickrEntryCount;
  protected $flickrEntries;

  /*
   *	Query the photo data and prepare it for filtering
   */
  function __construct() {
    $this->flickrEntries = TmpFlickrData::where('created_at', '<=', Carbon::now())->get();
  }

  protected function processPhotoCollection() {
    foreach ($this->flickrEntries as $flickrEntry) {

      //check each photo of this entry to see if its valid
      $this->sortPhotoCollection(unserialize($flickrEntry->response_data));

    }
  }

  protected function sortPhotoCollection($photoArrs) {

    // if photo is valid
    // store in accepted table

    // else
    // store in reject table
  }

  /*
   *	Scans image to see if it is valid
   *	Face Detection
   *
   *  @return bool
   */
  protected function _filterPhoto() {}

  // for each entry
  // loop though photos array
  // filter photo

}
