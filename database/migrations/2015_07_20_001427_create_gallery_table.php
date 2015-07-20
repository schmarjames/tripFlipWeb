<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGalleryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('gallery', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('user_id');
          $table->string('country_list');

          $table->foreign('user_id')->references('id')->on('users');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('gallery');
    }
}
