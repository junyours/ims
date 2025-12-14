<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CancelResponseEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('cancel-response-channel'); // or PrivateChannel('cancel-response-channel')
    }

    /**
     * Optional: custom event name
     */
    public function broadcastAs(): string
    {
        return 'cancel-response-event';
    }

    /**
     * Optional: define payload
     */
   public function broadcastWith(): array
    {
        return [
            'message' => "A barangay tanod has cancelled its response for request #{$this->message->id}",
            'request_id' => $this->message->id,
            'user_id' => $this->message->user_id,
        ];
    }

}
