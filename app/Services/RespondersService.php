<?php

namespace App\Services;

use App\Models\IncidentResponseRecord;
use App\Models\IncidentRequestResponse;
use App\Models\IncidentReport;
use App\Models\User;
use App\Models\FeedBackModel;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RespondersService
{
    public function getRespondersRecords(int $id)
    {
       return IncidentReport::with(['responseRecord.request.user','location.zone','incidentType.category','user'])
                            ->where('incident_reports.user_id', $id)
                            ->orderByDesc('created_at')
                            ->get();
    }

    public function respondersAverageResponseTime(int $id)
    {
        return IncidentResponseRecord::join('incident_reports as report', 'incident_response_records.report_id', '=', 'report.id')
            ->where('report.user_id', $id)
            ->selectRaw('AVG(incident_response_records.response_time) as avg_response_time')
            ->value('avg_response_time');
    }

    public function responseRecord(int $id)
    {
        return IncidentResponseRecord::with('report')
            ->whereHas('report', function($query) use ($id) {
                $query->where('user_id', $id);
            })
            ->get();
    }

    public function respondersResponseRating(int $id)
    {
        return FeedBackModel::where('tanod_id', $id)->avg('rating');
    }

    public function tanodResponseFeedBack(int $id)
    {
        return FeedBackModel::with('user')->where('tanod_id', $id)->get();
    }

    public function cancelRequest(array $data)
    {
        $request = IncidentRequestResponse::findOrFail($data['request_id']);
        $request->status = 'cancel';
        $request->reason = $data['reason'];
        $request->save();

        return $request;
    }

    public function respondersTotalReports(int $id)
    {
        $currentMonth = Carbon::now()->month;
        $previousMonth = Carbon::now()->subMonth()->month;

        // Current month count
        $now = IncidentReport::where('user_id', $id)
                    ->whereMonth('date', $currentMonth)
                    ->count();

        // Previous month count
        $prev = IncidentReport::where('user_id', $id)
                    ->whereMonth('date', $previousMonth)
                    ->count();

        // Calculate percentage change
        if ($prev === 0) {
            $percentageChange = $now === 0 ? 0 : 100; // If previous month is 0
        } else {
            $percentageChange = (($now - $prev) / $prev) * 100;
        }

        return [
            'current_month' => $now,
            'previous_month' => $prev,
            'percentage_change' => round($percentageChange, 2), // rounded to 2 decimals
        ];
    }
}