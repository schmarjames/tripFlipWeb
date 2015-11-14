<?php

use Illuminate\Database\Seeder;

class NotificationTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('notifications')->insert(
        array(
          array(
              "type"  => "Local Photos",
              "message" => "You have photos near your location."
          )
        )
      );
    }
}
