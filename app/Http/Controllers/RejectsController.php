<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

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
      return $rejectedPhotos;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
      $photo = RejectedPhotos::find($id);

      return $photo->delete();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id, string $table
     * @return Response
     */
    public function transfer($id, $table)
    {
      $photo = RejectedPhotos::find($id);

      // Insert photo data in table
      $reject = Accepted::create([
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
