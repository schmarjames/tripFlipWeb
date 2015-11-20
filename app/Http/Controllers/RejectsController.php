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
      "transfer" => "Photo was successfully moved to the accepted table",
      "delete" => "Photo is now deleted",
      "approve" => "Photo has been approved"
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
    /*public function index($amount, $lastQueryId)
    {
      $rejectedPhotos;
      if (is_numeric($lastQueryId)) {
        $rejectedPhotos = rejectedPhotos::select('*')
          ->where('id', '<', $lastQueryId)
          ->take($amount)
          ->get();
      } else {
        $rejectedPhotos = rejectedPhotos::select('*')
          ->take($amount)
          ->get();
      }

      var_dump($amount);
      var_dump($lastQueryId);
      die();
      //eturn response()->json($rejectedPhotos);
    }*/

    public function queryPhotos($amount, $lastQueryId, $locations) {
      $rejectedPhotos;

      $rejectedPhotos = RejectedPhotos::select('*')->whereIn("approved", [null, 0]);

      if ($locations) {
        $locations = json_decode($locations);
        if ($locations->country != "") {
            $rejectedPhotos = $rejectedPhotos->where('country', $locations->country);
        }

        if ($locations->stateRegion != "") {
            $rejectedPhotos = $rejectedPhotos->where('state_region', $locations->stateRegion);
        }

        if ($locations->city != "") {
            $rejectedPhotos = $rejectedPhotos->where('city', $locations->city);
        }
      }

      if (is_numeric($lastQueryId)) {
        $rejectedPhotos = $rejectedPhotos->where('id', '<', $lastQueryId);
      }

      $rejectedPhotos = $rejectedPhotos
        ->take($amount)
        ->orderBy('id', 'desc')
        ->get();

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
      if (!is_numeric($id)) return $this->message["error"]["delete"];
      $photo = RejectedPhotos::find($id);
      if (is_null($photo)) return $this->message["error"]["delete"];

      $photo->delete();
      return $this->message["success"]["delete"];
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

    /**
     * Toggle photos approval status
     *
     * @param  int  $id
     * @return Response
     */
     public function approve($id) {
       $photo = RejectedPhotos::where('id', $id)->update(['approved'=> 1]);

       if (!is_null($photo)) {
         return $this->message["success"]["approve"];
       }
     }
}
