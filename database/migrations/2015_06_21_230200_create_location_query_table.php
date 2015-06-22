<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocationQueryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('location_query', function (Blueprint $table) {
            $table->increments('id');
            $table->string('country');
            $table->string('state_region')->nullable();
            $table->string('city')->nullable();
            $table->integer('total_pages');
            $table->integer('current_page');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('location_query');
    }
}
