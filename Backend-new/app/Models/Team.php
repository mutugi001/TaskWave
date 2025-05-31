<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;


class Team extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'team_name',
        'description',
    ];
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function member()
    {
        return $this->hasMany(Member::class);
    }
    public function members()
    {
        return $this->belongsToMany(
            Member::class,
            'member_team',
            'team_id',
            'member_id'
        );
    }
}
