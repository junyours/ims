<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\CancelRequestEvent;
use App\Services\RespondersService;
use App\Services\FirebaseService;

class RespondersController extends Controller
{
    protected $responders;
    protected $firebase;

    public function __construct(RespondersService $responders, FirebaseService $firebase) {
        $this->responders = $responders;
        $this->firebase = $firebase;
    }

    public function respondersRecords($id)
    {
        $records = $this->responders->getRespondersRecords($id);

        return response()->json(['records' => $records]);
    }

    public function respondersStats($id)
    {
        $response_time = $this->responders->respondersAverageResponseTime($id);

        $response_record = $this->responders->responseRecord($id);

        $tanod_rating = $this->responders->respondersResponseRating($id);

        $feedback = $this->responders->tanodResponseFeedBack($id);

        return response()->json([
            'response_time' => $response_time, 
            'response_record' => $response_record,
            'rating' => round($tanod_rating),
            'feedback' => $feedback
        ]);
    }

    public function cancelRequest(Request $request)
    {
        $data = $request->validate([
            'request_id' => 'required|exists:incident_request_responses,id',
            'reason' => 'required'
        ]);

        $cancel_request = $this->responders->cancelRequest($data);

        $firebase = $this->firebase->sendFCMNotification(
                                    title: 'Incident Request Cancelled.',
                                    body: "Incident Request #{$cancel_request->id} has been cancelled"
                                );

        broadcast(new CancelRequestEvent($cancel_request));

        return response()->json(['request_cancelled' => $cancel_request]);
    }

    public function respondersTotalReports($id)
    {
        $data = $this->responders->respondersTotalReports($id);

        return response()->json(['responders' => $data]);
    }
}
