<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\SightingRequest;
use App\Services\WatchListService;
use App\Services\FirebaseService;
use App\Events\SightedEvent;

class SightingReportController extends Controller
{
    protected $watchList;
    protected $firebase;

    public function __construct(WatchListService $watchList, FirebaseService $firebase)
    {
        $this->watchList = $watchList;
        $this->firebase = $firebase;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SightingRequest $request)
    {
        $data = $this->watchList->sightingReport($request->validated());

        $firebase = $this->firebase->sendFCMNotification(
                                    title: 'Watch-List Sighted Report.',
                                    body: "An individual or vehicle has been reportedly sighted."
                                );
         try {
            broadcast(new SightedEvent($data));
            } catch (\Throwable $e) {
                \Log::warning('Broadcast failed', ['e' => $e->getMessage()]);
            }
        
        return response()->json(['sighted_report' => $data]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
