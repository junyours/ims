<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\ChatBoxService;
use App\Events\ChatBoxEvent;
use App\Http\Requests\FeedBackRequest;
use App\Events\PrivateChatEvent;
use App\Events\CancelResponseEvent;
use App\Services\FirebaseService;

class ChatBoxController extends Controller
{
    protected $chatBox;
    protected $firebase;

    public function __construct(ChatBoxService $chatBox, FirebaseService $firebase)
    {
        $this->chatBox = $chatBox;
        $this->firebase = $firebase;
    }

    public function getMessages($id)
    {
        $messages = $this->chatBox->getMessages($id);

        return response()->json(['messages' => $messages]);
    }

    public function sendMessage(Request $request)
    {
        $data = $request->validate([
            'request_id' => 'required|exists:incident_request_responses,id',
            'message' => 'required'
        ]);

        $chatMessage = $this->chatBox->createMessage($data);

        $status = $this->chatBox->updateStatus($data['request_id']);

        broadcast(new ChatBoxEvent(
                action: 'chat',   // 👈 IMPORTANT
                message: $chatMessage
            ));


        return response()->json(['message' => $chatMessage]);
    }

    public function feedback(FeedBackRequest $request)
    {
        \Log::info('Incoming feedback:', $request->all());
        
        $feedback = $this->chatBox->feedback($request->validated());

        return response()->json($feedback);
    }

    public function privateChat($id)
    {
        $chat = $this->chatBox->privateChannel($id);

        broadcast(new PrivateChatEvent($chat));
        
        return response()->json($chat);
    }

    public function cancelResponse(Request $request)
    {
         $data = $request->validate([
            'request_id' => 'required|exists:incident_request_responses,id',
            'message' => 'required'
        ]);

        $chatMessage = $this->chatBox->cancelResponse($data);

        $firebase = $this->firebase->sendResidentFCMNotification(
                                    title: 'Response Cancelled.',
                                    body: "a barangay tanod has cancelled it's response #{$message->user->id}"
                                );

        // broadcast(new CancelResponseEvent($message));
                broadcast(new ChatBoxEvent(
                action: 'cancel',   // 👈 IMPORTANT
                message: $chatMessage
            ));

        return response()->json($chatMessage);
    }
}
