<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRejectedPhotosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rejected_photos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('country');
            $table->string('state_region')->nullable();
            $table->string('city')->nullable();
            $table->text('photo_data');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('rejected_photos');
    }
}
