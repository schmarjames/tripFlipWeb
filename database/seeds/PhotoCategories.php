<?php

use Illuminate\Database\Seeder;

class PhotoCategories extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('photo_categories')->insert(
        array(
          array(
              "category"  => "landscape"
          ),
          array(
              "category"  => "indoor"
          ),
          array(
              "category"  => "outdoor"
          ),
          array(
              "category"  => "waterfront"
          ),
          array(
              "category"  => "architecture"
          ),
          array(
              "category"  => "city"
          )
        )
      );
    }
}
