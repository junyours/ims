<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SightingReport extends Model
{
    use HasFactory;

    protected $table = 'sighting_reports';

    protected $fillable = [
        'reporter_id', 'subject_id', 'location', 'latitude', 'longitude', 'note'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function subject()
    {
        return $this->belongsTo(WatchList::class, 'subject_id');
    }
}
