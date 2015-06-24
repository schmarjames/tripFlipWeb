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

Route::get('/', function () {
    return view('welcome');
});


Route::get('/photos', function () {
    //dd(Carbon\Carbon::now());

    $photos = new App\Console\Commands\PhotoFilter();
    $photos->getPhotoData();

    /*
    $locations = App\LocationQuery::all();
    $photoData = new App\Console\Commands\PhotoData();
    $photoData->queryPhotos();
    */
});
