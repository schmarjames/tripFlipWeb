<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Gallery;
use App\Countries;
use App\Likes;
use App\Tfphotos;

class GalleryController extends Controller
{

  protected $message = [
    "error" => [
      "get_countries" => "Sorry, unable to get your favorite countries",
      "get_country_photos" => "Sorry, unable to get the countries photos"
    ],
    "success" => [
      "store" => "Photo was successfully approved",
      "transfer" => "Photo was successfully moved to the rejected table",
      "delete" => "Photo is now deleted"
      ]
  ];

  /**
   * Return a list of country ids based on the users id.
   *
   * @param  int  $id
   * @return Response
   */
    public function index($id)
    {
        if (!is_numeric($id) || is_null($id)) return response()->json($this->message["error"]["get_countries"]);

        // Get gallery list of matching user
        $gallery = Gallery::where('user_id', $id)->first();
        return response()->json($gallery->country_list);
    }

    /**
     * Get an array of photo urls based on the country id and query number.
     *
     * @param  int  $id, int $country_id, int $query_num
     * @return Response
     */
    public function getPhotos($id, $country_id, $query_num)
    {
      if (!is_numeric($id) || !is_numeric($country_id)) return response()->json($this->message["error"]["get_country_photos"]);
      $limit = 50;
      $start_row = ($query_num * $limit) - $limit;
      $query_num = (is_null($query_num) || !is_numeric($query_num) || $query_num < 1) ? 1 * $max : $query_num * $max;

      if(Countries::first($country_id)) {
        // get all photos liked by user
        $likes = Likes::find($id)->get('photo_id')->toArray();
        return response()->json(Tfphotos::whereIn('country_id', $likes)-take($limit)->skip($start_row)->get('url')->toArray());
      }
      return response()->json($this->message["error"]["get_country_photos"]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        //
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
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
        //
    }
}
