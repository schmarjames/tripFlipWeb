<?php

namespace App\Jobs;

use App\LocationQuery;
use App\Jobs\Job;
use TripFlip\PhotoData;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;

class QueryPhotoData extends Job implements SelfHandling, ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    protected $locations;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($locations)
    {
        $this->locations = $locations;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $photo = new PhotoData();
        $photo->prepareRequest($this->locations);
    }
}
