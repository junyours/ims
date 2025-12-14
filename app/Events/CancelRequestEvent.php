<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CancelRequestEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $cancel_request;
    /**
     * Create a new event instance.
     */
    public function __construct($cancel_request)
    {
        $this->cancel_request = $cancel_request;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('cancel-request-channel'); 
    }

    /**
     * Optional: custom event name
     */
    public function broadcastAs(): string
    {
        return 'cancel-request-event';
    }

    /**
     * Optional: define payload
     */
    public function broadcastWith(): array
    {
        return [
            'request' => $this->cancel_request,
            'reason' => $this->cancel_request->reason,
        ];
    }
}
