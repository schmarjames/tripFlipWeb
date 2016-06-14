<?php

use Illuminate\Database\Seeder;

class LocationQueryTableSeeder extends Seeder {

    public function run() {
        DB::table('location_query')->insert(
            array(
                array(
                    "country"       => "",
                    "state_region"  => "Florida",
                    "city"          => 'Naples',
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "Colombia",
                    "state_region"  => "",
                    "city"          => "Medellin",
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "Italy",
                    "state_region"  => "",
                    "city"          => 'Rome',
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "Greece",
                    "state_region"  => "",
                    "city"          => "Mykonos",
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "Czech Republic",
                    "state_region"  => "",
                    "city"          => "Prague",
                    "total_pages"   => 0,
                    "current_page"  => 0
                )
            )
        );
    }

}
