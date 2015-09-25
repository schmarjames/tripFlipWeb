<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RejectedPhotos;
use App\AcceptedPhotos;
use App\Countries;
use App\StateRegions;
use App\Cities;
use App\County;
use App\LocationData;
use App\Tfphotos;

class RejectsController extends Controller
{
  protected $message = [
    "error" => [
      "transfer" => "Photo could not be transferred to the accepted table",
      "delete" => "Photo could not be deleted"
    ],
    "success" => [
      "transfer" => "Photo was successfully moved to the rejected table",
      "delete" => "Photo is now deleted"
      ]
  ];

  public function __construct() {
    \Config::set('auth.model', 'App\AdminUsers');
    $this->middleware('jwt.auth');
  }
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
      $rejectedPhotos = RejectedPhotos::all();
      return response()->json($rejectedPhotos);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
      if(!is_numeric($id)) return $this->message["error"]["delete"];
      $photo = RejectedPhotos::find($id)->delete();

      return $this->message["error"]["delete"];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function transfer($id)
    {

      if(!is_numeric($id)) return $this->message["error"]["transfer"];
      $photo = RejectedPhotos::find($id);

      // Insert photo data in table
      $reject = AcceptedPhotos::create([
        'country' => $photo->country,
        'state_region' => $photo->state_region,
        'city' => $photo->city,
        'photo_data' => $photo->photo_data
      ]);

      if(is_null($reject)) {
        return $this->message["error"]["transfer"];
      }

      // Delete entry from accepted table
      $photo->delete();
      return $this->message["success"]["transfer"];
    }
}