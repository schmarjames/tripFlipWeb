<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TfphotosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('tfphotos', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('location_id');
          $table->integer('country_id');
          $table->integer('state_region_id')->nullable();
          $table->integer('city_id')->nullable();
          $table->integer('county_id')->nullable();
          $table->string('url');

          $table->foreign('country_id')->references('id')->on('countries');
          $table->foreign('state_region_id')->references('id')->on('state_regions');
          $table->foreign('city_id')->references('id')->on('cities');
          $table->foreign('county_id')->references('id')->on('county');
          $table->foreign('location_id')->references('id')->on('location_data');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('tfphotos');
    }
}
