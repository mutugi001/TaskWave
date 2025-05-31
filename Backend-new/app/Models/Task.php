<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasUlids, HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'assigned_team',
        'status',
        'due_date',
        'dependent_task_id',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function dependentTasks()
    {
        return $this->hasMany(Task::class, 'dependent_task_id');
    }

    public function dependentTask()
    {
        return $this->belongsTo(Task::class, 'dependent_task_id');
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public static function countTasksByStatus($projectId, $status)
    {
        return self::where('project_id', $projectId)->where('status', $status)->count();
    }
}
