<?php

use Illuminate\Database\Seeder;

class AdminPermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('admin_permissions')->insert(
        array(
          array(
              "permission_type"  => "primary"
          ),
          array(
              "permission_type"  => "secondary"
          )
        )
      );
    }
}
