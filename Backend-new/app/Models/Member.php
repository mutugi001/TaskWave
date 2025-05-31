<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Member extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'role',
        'profile_picture',
        'user_id',
        'team_id',
    ];

    protected $appends = ['profile_picture_url'];

    public function teams()
    {
        return $this->belongsToMany(
            Team::class,        // Related model
            'member_team',      // Pivot table name
            'member_id',        // FK on pivot for this model
            'team_id'           // FK on pivot for related model
        );;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getProfilePictureUrlAttribute()
    {
        return $this->profile_picture
            ? asset('storage/' . $this->profile_picture)
            : null;
    }
}


