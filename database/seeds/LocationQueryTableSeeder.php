<?php

use Illuminate\Database\Seeder;

class LocationQueryTableSeeder extends Seeder {

    public function run() {
        DB::table('location_query')->insert(
            array(
                array(
                    "country"       => "Germany",
                    "state_region"  => "",
                    "city"          => "Hamburg",
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "Thailand",
                    "state_region"  => "",
                    "city"          => "Bangkok",
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "Taiwan",
                    "state_region"  => "",
                    "city"          => "Taichung",
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "Austria",
                    "state_region"  => "",
                    "city"          => "Gastein",
                    "total_pages"   => 0,
                    "current_page"  => 0
                ),
                array(
                    "country"       => "Germany",
                    "state_region"  => "",
                    "city"          => "Bavaria",
                    "total_pages"   => 0,
                    "current_page"  => 0
                )
            )
        );
    }

}
