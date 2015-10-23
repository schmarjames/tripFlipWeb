<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Gallery;
use App\Countries;
use App\Likes;
use App\Tfphotos;
use App\PhotoCategories;
use App\CategoryTagsOfPhotos;

class GalleryController extends Controller
{

  protected $message = [
    "error" => [
      "get_countries" => "Sorry, unable to get your favorite countries",
      "get_country_photos" => "Sorry, unable to get the countries photos"
    ]
  ];

  public function __construct() {
    \Config::set('auth.model', 'App\User');
    $this->middleware('jwt.auth');
  }

  /**
   * Return a list of country ids based on the users id.
   *
   * @param  int  $id
   * @return Response
   */
    public function getGallery($id)
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
      $query_num = (is_null($query_num) || !is_numeric($query_num) || $query_num < 1) ? 1 : $query_num;
      $start_row = ($query_num * $limit) - $limit;

      if(Countries::where('id', $country_id)->first()) {
        // get all photos liked by user
        $likes = Likes::where('user_id', $id)
          ->select('photo_id')
          ->get()
          ->toArray();

        return response()->json(
          Tfphotos::whereIn('country_id', $likes)
            ->take($limit)
            ->skip($start_row)
            ->select('url')
            ->get()
            ->toArray()
        );
      }
      return response()->json($this->message["error"]["get_country_photos"]);
    }

    public function getUserCategories(Request $request) {
      $user = \JWTAuth::parseToken()->authenticate();
      $data = \Input::all();

      $categories = PhotoCategories::all()
        ->map(function($category) use ($user) {
          $categoryInfo = [];
          $categoryInfo['likesAmount'] = Likes::select('*')
            ->whereIn('photo_id', function($query) use ($category) {

              $query
                ->from('category_tags_of_photos')
                ->selectRaw('photo_id')
                ->where('category_id', '=', $category->id);

            })
            ->where('user_id', $user->id)
            ->get()
            ->count();

            $categoryInfo['category_id'] = $category->id;
            $categoryInfo['category_name'] = $category->category;

        });
        var_dump($categories);
        die();

    }

    /*public function getGalleryCollection(Request $request) {
      $user = \JWTAuth::parseToken()->authenticate();
      $data = \Input::all();

      if ($data['queryType'] == 'category') {
        $collection = $this->getCategoriesCollection();
      } else if ($data['queryType'] == ) {

      }
    }*/

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
