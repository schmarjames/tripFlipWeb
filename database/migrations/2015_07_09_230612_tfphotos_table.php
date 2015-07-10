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
          $table->int('geo');
          $table->int('country_id');
          $table->int('state_region_id');->nullable();
          $table->int('city_id')->nullable();
          $table->string('flickr_url');

          $table->foreign('country_id')->reference('id')->on('countries');
          $table->foreign('state_region_id')->reference('id')->on('state_regions');
          $table->foreign('city_id')->reference('id')->on('cities');
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
