<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Jobs\QueryPhotoData;
use App\Jobs\FilterDataQueue;
use App\LocationQuery;
use App\TmpFlickrData;
use App\AcceptedPhotos;
use App\RejectedPhotos;
use Carbon\Carbon;

class PhotoApiController extends Controller
{

  protected $flickrEntryCount;
  protected $flickrEntries;
  protected $country;
  protected $state_region;
  protected $city;

    public function locationQuery(Request $request) {
      $locations = LocationQuery::all();
      $this->dispatch(new QueryPhotoData($locations));
    }

    public function filterData(Request $request) {
      $temps = TmpFlickrData::where('created_at', '<=', Carbon::now())->select('id')->get()->toArray();
      $tmpIds = array_column($temps, 'id');
      //$this->dispatch(new FilterDataQueue($tmpIds));
      $entry = TmpFlickrData::where('id', '=', $flickrEntry)->get();

      $this->country      = $entry->country;
      $this->state_region = $entry->state_region;
      $this->city         = $entry->city;

    //check each photo of this entry to see if its valid
    $this->_sortPhotoCollection(unserialize($entry->response_data));
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

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
