<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterColumnOnLocationQueryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('location_query', function (Blueprint $table) {
            DB::statement("ALTER TABLE location_query ALTER COLUMN city type character varying(255)[] using array[city]");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('location_query', function (Blueprint $table) {
            DB::statement("ALTER TABLE location_query ALTER COLUMN city type varchar(255)");
        });
    }
}
