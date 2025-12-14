<?php

namespace App\Services;

use App\Models\WatchList;
use App\Models\SightingReport;
use Illuminate\Support\Facades\Storage;

class WatchListService
{
    /**
     * Add a new WatchList record.
     *
     * @param array $data
     * @return WatchList
     */
    public function addWatchList(array $data): WatchList
    {
        if (isset($data['image']) && $data['image']) {
            $path = $data['image']->store('watchlist', 'public');
            $data['image'] = $path;
        }

        return WatchList::create([
            'type' => $data['type'],
            'identifier' => $data['identifier'],
            'details' => $data['details'],
            'reason' => $data['reason'],
            'image' => $data['image'],
        ]);
    }

    public function getWatchList()
    {
        return WatchList::orderByDesc('created_at')
                        ->get()->map(function ($watchList) {
                        if ($watchList->image) {
                            if (!str_starts_with($watchList->image, 'http')) {
                                $watchList->image = asset('/storage/' . $watchList->image);
                            }
                        }
                        return $watchList; 
                    });
    }

    public function getDetails(int $id)
    {
        $details = WatchList::with('sightingReports.user')->findOrFail($id);

        $details->image = asset('storage/' . $details->image);

        return $details;
    }

    public function updateStatus(int $id)
    {
        $data = WatchList::findOrFail($id);
        $data->status = $data->status === 'active' ? 'inactive' : 'active';
        $data->save();

        return $data;
    }

    public function sightingReport(array $data): SightingReport
    {
        return SightingReport::create([
            'reporter_id' => auth()->id(),
            'subject_id' =>$data['subject_id'],
            'location' => $data['location'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'note' => $data['note'] ?? null,
        ]);
    }

}
