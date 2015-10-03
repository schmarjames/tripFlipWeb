<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use App\PhotoCategories;
use App\Tfphotos;
use App\CategoryTagsOfPhotos;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['prefix' => 'api', 'middleware' => 'cors'], function() {
  Route::resource('auth', 'AuthenticateController@auth');
  Route::post('adminauth', 'AuthenticateController@adminAuth');
  Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');
  Route::post('authregister', 'AuthenticateController@authRegister');
  Route::post('authAssignTemp', 'AuthenticateController@assignTemporaryPassword');
  Route::post('authChangeCred', 'AuthenticateController@changeUserCredentials');

  Route::post('location', 'PhotoApiController@locationQuery');

  Route::resource('rejects', 'RejectsController', ['only' => ['index', 'destroy']]);
  Route::post('rejects/photos/{amount}/{lastQuery}', 'RejectsController@queryPhotos');
  Route::post('rejects/transfer/{id}', 'RejectsController@transfer');

  Route::resource('accepts', 'AcceptsController', ['only' => ['index']]);
  Route::post('accepts/photos/{amount}/{lastQuery}', 'AcceptsController@queryPhotos');
  Route::post('accepts/store/{id}', 'AcceptsController@store');
  Route::post('accepts/transfer/{id}', 'AcceptsController@transfer');

  Route::get('gallery/{id}', 'GalleryController@getGallery');
  Route::post('gallery/{id}/{country_id}/{query_num}', 'GalleryController@getPhotos');


  Route::post('photo/collection', 'PhotoController@getCollection');
  Route::post('photo/randomcollection', 'PhotoController@getRandomCollection');
  Route::post('photo/updatecount', 'PhotoController@getUpdatePhotoFeedCount');
  Route::post('photo/likelist/{photo_id}', 'PhotoController@getSpecificLikes');
  Route::post('photo/visitors/{photo_id}', 'PhotoController@getVisitors');
  Route::post('photo/views/{view_array}', 'PhotoController@addViews');
  Route::post('photo/like/{user_id}/{photo_id}', 'PhotoController@addLikes');
});

Route::get('/photos', function() {

  $photos = Tfphotos::all();
  $taggedPhotos = CategoryTagsOfPhotos::select('photo_id')->get()->toArray();

  foreach($photos as $photo) {
    if (in_array($photo->id, $taggedPhotos)) continue;
    $photo_url = explode('/', $photo->url);
    $photo_id = explode('_', $photo_url[4])[0];


    $base_url = 'https://api.flickr.com/services/rest/?method=';
    $method = 'flickr.photos.getInfo';
    $format = 'json';
    $nojsoncallback = 1;

     $client = new \GuzzleHttp\Client();
     $url = sprintf('%s%s&api_key=%s&photo_id=%d&format=%s&nojsoncallback=%d',
       $base_url,
       $method,
       \Config::get('constants.FLICKR_API'),
       $photo_id,
       $format,
       $nojsoncallback
     );

     $response = $client->get($url);
     $res_data = $response->getBody()->getContents();
     $res_arr = json_decode($res_data, true);

     $categories = PhotoCategories::all()->toArray();
     $tags = array_column($res_arr["photo"]["tags"]["tag"], "_content");
     $res = [];

     foreach($categories as $category) {
       if (in_array($category["category"], $tags)) {
         array_push($res, $category["id"]);
       }
     }

     if (count($res) > 0) {
       foreach($res as $r) {
         CategoryTagsOfPhotos::create([
             'photo_id' => $photo->id,
             'category_id' => $r
           ]);
       }
     } else {
       Tfphotos::find($photos->id)->delete();
     }
  }



});
