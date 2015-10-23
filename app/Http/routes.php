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
  Route::post('gallery/usercategories', 'GalleryController@getUserCategories');
  Route::post('gallery/usercategorycollection', 'GalleryController@getUserCategoryCollection');
  Route::get('gallery/locationoptions', 'GalleryController@gallerySearchOptions');


  Route::post('photo/collection', 'PhotoController@getCollection');
  Route::post('photo/randomcollection', 'PhotoController@getRandomCollection');
  Route::get('photo/categoryphotos', 'PhotoController@getCategoryPhotos');
  Route::post('photo/updatecount', 'PhotoController@getUpdatePhotoFeedCount');
  Route::post('photo/likelist/{photo_id}', 'PhotoController@getSpecificLikes');
  Route::post('photo/visitors/{photo_id}', 'PhotoController@getVisitors');
  Route::post('photo/views/{view_array}', 'PhotoController@addViews');
  Route::post('photo/like', 'PhotoController@addLikes');
});
