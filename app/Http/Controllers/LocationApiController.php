<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Jobs\QueryPhotoData;
use App\Jobs\FilterDataQueue;
use App\LocationQuery;
use App\TmpFlickrData;
use Carbon\Carbon;
use Log;


class LocationApiController extends Controller {

  public function handleLocation(Request $request) {
    $data = \Input::all();
    //dd($data["geo"]);
    Log::info($request);


  }

}
