<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedBackModel extends Model
{
    use HasFactory;

    protected $table = 'feed_back_models';

    protected $fillable = ['user_id', 'request_id', 'tanod_id', 'rating', 'feedback'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tanod()
    {
        return $this->belongsTo(User::class, 'tanod_id');
    }

    public function request()
    {
        return $this->belongsTo(IncidentRequestResponse::class, 'request_id', 'id');
    }
}
