<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WatchList extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'watch_lists';

    protected $fillable = [
        'type', 'identifier', 'details', 'reason', 'image', 'status'
    ];

    public function sightingReports()
    {
        return $this->hasMany(SightingReport::class, 'subject_id');
    }
}
