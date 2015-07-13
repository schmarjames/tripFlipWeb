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

        /*DB::table('users')->insert([
            'name' => 'Schmar',
            'email' => 'loyd.slj@gmail.com',
            'password' => bcrypt('AudiR8'),
            'created_at' => Carbon\Carbon::now(),
            'updated_at' => Carbon\Carbon::now(),
        ]);*/

        Model::reguard();
    }
}
