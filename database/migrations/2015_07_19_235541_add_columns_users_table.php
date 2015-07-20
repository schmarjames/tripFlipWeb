<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('users', function (Blueprint $table) {
          $table->string('address');
          $table->string('city');
          $table->string('state_region');
          $table->string('country');
          $table->string('zip_code');
          $table->string('profile_pic');
          $table->string('geo');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('address');
        $table->dropColumn('city');
        $table->dropColumn('state_region');
        $table->dropColumn('country');
        $table->dropColumn('zip_code');
        $table->dropColumn('profile_pic');
        $table->dropColumn('geo');
      });
    }
}
