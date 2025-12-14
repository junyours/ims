<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SightedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data; 
    /**
     * Create a new event instance.
     */
    public function __construct($data)
    {
       $this->data = ['sighting_report' => $data];
    }

    public function broadcastOn()
    {
        return ['sighted-submitted-channel'];
    }

    public function broadcastAs()
    {
        return 'sighted-submitted-event';
    }

    public function broadcastWith()
    {
        return $this->data;
    }
}
