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

class PhotoApiController extends Controller
{

    public function locationQuery(Request $request) {
      $data = \Input::all();
      $locations;

      if (array_key_exists('id', $data)) {
        if (!is_null($data['id'])) {
            if (is_array($data['id'])) {
              $locations = LocationQuery::whereIn('id', $data['id'])->get();
            } else {
              $locations = LocationQuery::where('id', $data['id'])->get();
            }
        } else {
          $locations = LocationQuery::all();
        }
      }
      $this->dispatch(new QueryPhotoData($locations));
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
