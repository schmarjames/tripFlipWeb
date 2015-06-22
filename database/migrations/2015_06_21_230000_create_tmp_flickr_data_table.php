<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTmpFlickrDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tmp_flickr_data', function (Blueprint $table) {
            $table->increments('id');
            $table->string('country');
            $table->string('state_region')->nullable();
            $table->string('city')->nullable();
            $table->text('response_data');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('tmp_flickr_data');
    }
}
