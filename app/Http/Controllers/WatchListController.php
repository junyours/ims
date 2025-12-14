<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\WatchListRequest;
use App\Services\WatchListService;

class WatchListController extends Controller
{
    protected $watchList;

    public function __construct(WatchListService $watchList)
    {
        $this->watchList = $watchList;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = $this->watchList->getWatchList();

        return response()->json(['watchList' => $data]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(WatchListRequest $request)
    {
         $data = $this->watchList->addWatchList($request->validated());

        return response()->json(['watchList' => $data]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = $this->watchList->getDetails($id);

        return response()->json(['details' => $data]);
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
        $data = $this->watchList->updateStatus($id);

        return response()->json(['status' => $data]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
