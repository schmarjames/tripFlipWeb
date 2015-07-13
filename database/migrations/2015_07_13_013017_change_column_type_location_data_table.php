<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeColumnTypeLocationDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('alter table location_data alter column lat type float using lat::float');
        DB::statement('alter table location_data alter column long type float using long::float');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      DB::statement('alter table location_data alter column lat type int using lat::int');
      DB::statement('alter table location_data alter column long type int using long::int');
    }
}
