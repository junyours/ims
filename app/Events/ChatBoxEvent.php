<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatBoxEvent implements ShouldBroadcast
{
    public $action;
    public $message;
    public $extra;

    public function __construct($action, $message = null, $extra = [])
    {
        $this->action = $action;
        $this->message = $message;
        $this->extra = $extra;
    }

    public function broadcastOn()
    {
        return new Channel('new-message-channel');
    }

    public function broadcastAs()
    {
        return 'new-message-event';
    }

    public function broadcastWith()
    {
        return [
            'action'  => $this->action,
            'message' => $this->message,
        ];
    }
}
