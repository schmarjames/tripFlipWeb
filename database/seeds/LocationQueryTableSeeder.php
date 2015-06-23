<?php

use Illuminate\Database\Seeder;

class LocationQueryTableSeeder extends Seeder {

    public function run() {
        DB::table('location_query')->insert(
            array(
                array(
                    "country"       => "spain",
                    "state_region"  => "",
                    "city"          => 'barcelona',
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "greece",
                    "state_region"  => "",
                    "city"          => 'athens, aegean',
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "turkey",
                    "state_region"  => "",
                    "city"          => 'istanbul',
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "argentina",
                    "state_region"  => "",
                    "city"          => 'buenos, aires',
                    "total_pages"   => 0,
                    "current_page"  => 0
                )
            )
        );
    }

}
