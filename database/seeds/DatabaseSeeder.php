<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        // $this->call('UserTableSeeder');
        //$this->call('LocationQueryTableSeeder');

        DB::table('admin_users')->insert([
            'name' => 'Test',
            'email' => 'test@gmail.com',
            'password' => bcrypt('Impala96'),
            'remember_token' => null,
            'created_at' => Carbon\Carbon::now(),
            'updated_at' => Carbon\Carbon::now(),
            'permission_type' => 2
        ]);

        /*DB::table('users')->insert([
            'name' => 'Rob',
            'email' => 'rob@gmail.com',
            'password' => bcrypt('AudiR8'),
            'address' => '4537 S. Leclaire',
            'city' => 'Chicago',
            'state_region' => 'Illinois',
            'country' => 'USA',
            'zip_code' => '60638',
            'profile_pic' => 'img/profie.jpg',
            'geo' => "4.3, 2.3",
            'created_at' => Carbon\Carbon::now(),
            'updated_at' => Carbon\Carbon::now(),
        ]);*/

        /*DB::table('gallery')->insert([
            'user_id' => 4,
            'country_list' => json_encode([2,3,4,5,6,7])
        ]);*/

        /*DB::table('likes')->insert([
            'user_id' => 4,
            'photo_id' => 1,
        ]);
        DB::table('likes')->insert([
            'user_id' => 4,
            'photo_id' => 2,
        ]);
        DB::table('likes')->insert([
            'user_id' => 4,
            'photo_id' => 6,
        ]);
        DB::table('likes')->insert([
            'user_id' => 4,
            'photo_id' => 5,
        ]);*/

        Model::reguard();
    }
}
