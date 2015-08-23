<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTimestampsToTfphotos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tfphotos', function (Blueprint $table) {
            $table->timestamp('created_at')
              ->default(DB::raw('CURRENT_TIMESTAMP(0)'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tfphotos', function (Blueprint $table) {
            $table->dropTimestamps();
        });
    }
}
