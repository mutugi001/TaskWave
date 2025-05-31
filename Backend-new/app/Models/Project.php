<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Project extends Model
{
    use HasUlids;
    protected $fillable = [
        'user_id',
        'project_name',
        'description',
        'category',
        'objectives',
        'start_date',
        'end_date',
        'status',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function task()
    {
        return $this->hasMany(Task::class);
    }
}
