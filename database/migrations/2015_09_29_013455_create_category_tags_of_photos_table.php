<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoryTagsOfPhotosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_tags_of_photos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('photo_id');
            $table->integer('category_id');

            $table->foreign('photo_id')->references('id')->on('tfphotos');
            $table->foreign('category_id')->references('id')->on('photo_categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('category_tags_of_photos');
    }
}
