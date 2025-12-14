<?php

namespace App\Services;

use App\Models\ViolatorsProfile;
use App\Models\ViolatorsRecord;
use App\Models\User;

class ViolatorService
{
    public function getViolatorsDetails(int $id): ViolatorsProfile
    {
        $violator = ViolatorsProfile::with(['zone', 'reports.incidentType.category', 'reports.location.zone'])
                                    ->findOrFail($id);
        $violator->photo = asset('storage/' . $violator->photo);

        return $violator;
    }

    public function violatorsViolationCount()
    {
        return ViolatorsProfile::withCount(['violationRecords as total_violations' => function ($query) {
                            $query->join('incident_reports', 'incident_reports.id', '=', 'violators_records.report_id');
                            }])
                            ->orderByDesc('total_violations')
                            ->limit(5)
                            ->get(['id', 'first_name'])
                            ->map(function ($violator) {
                                if($violator->photo) {
                                    if(!str_starts_with($violator->photo, 'http')) {
                                        $violator->photo = asset('storage/'. $violator->photo);
                                    }
                                }
                            return $violator;
                            });
    }

    public function getResidents()
    {
        return User::with('requests')->where('role','=','resident')->get()
                        ->map(function ($user) {
                            if($user->identification) {
                                if(!str_starts_with($user->identification, 'http')) {
                                    $user->identification = asset('storage/' . $user->identification);
                                }
                            }
                        return $user;
                        });
    }

    public function blockUser(int $id)
    {
        $user = User::findOrFail($id);
        $user->status = 'block';
        $user->save();

        return $user;
    }

    public function unBlockUser(int $id)
    {
        $user = User::findOrFail($id);
        $user->status = 'active';
        $user->save();

        return $user;
    }
}
