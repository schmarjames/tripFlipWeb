<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLikesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('likes', function (Blueprint $table) {
          $table->integer('user_id');
          $table->integer('photo_id');


          $table->foreign('user_id')->references('id')->on('users');
          $table->foreign('photo_id')->references('id')->on('tfphotos');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('likes');
    }
}
