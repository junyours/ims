<?php

namespace App\Services;

use App\Models\ChatBoxModel;
use App\Models\IncidentRequestResponse;
use App\Models\FeedBackModel;

class ChatBoxService
{
    // Your service logic here

   public function messages(int $requestId): ChatBoxModel
    {
        return ChatBoxModel::create([
            'request_id' => $requestId,
            'user_id' => auth()->id(),
            'message' => 'Requesting Incident Response.',
        ]);
    }
    
    public function getMessages(int $id)
    {
        return ChatBoxModel::with('users')->where('request_id', $id)->get();
    }

    public function createMessage(array $data): ChatBoxModel
    {
        return ChatBoxModel::create([
            'request_id' => $data['request_id'],
            'user_id' => auth()->id(),
            'message' => $data['message'],
        ]);
    }

    public function cancelResponse(array $data): ChatBoxModel
    {
        return ChatBoxModel::create([
            'request_id' => $data['request_id'],
            'user_id' => auth()->id(),
            'message' => $data['message'],
        ]);
    }

    public function updateStatus(int $id)
    {
        $status = IncidentRequestResponse::findOrFail($id);
        $status->status = "ongoing";
        $status->save();
    }

    public function feedback(array $data)
    {
        return FeedBackModel::create([
            'user_id' => auth()->id(),
            'request_id' => $data['request_id'],
            'tanod_id' => $data['tanod_id'],
            'rating' => $data['rating'],
            'feedback' => $data['feedback']
        ]);
    }

    public function privateChannel(int $id)
    {
        $chat = IncidentRequestResponse::findOrFail($id);
        $chat->is_public = false;
        $chat->save();

        return $chat;
    }
}