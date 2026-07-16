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
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Tasks this task depends on
    public function dependencies()
    {
        // tasks_id is the local key, dependent_task_id is the related key
        return $this->belongsToMany(
            Task::class,
            'task_dependencies',
            'tasks_id',
            'dependent_task_id'
        );
    }

    public function dependents()
    {
        // dependent_task_id is the local key, tasks_id is the related key
        return $this->belongsToMany(
            Task::class,
            'task_dependencies',
            'dependent_task_id',
            'tasks_id'
        );
    }

    public function team()
    {
        return $this->belongsTo(Team::class, 'assigned_team');
    }

    public static function countTasksByStatus($projectId, $status)
    {
        return self::where('project_id', $projectId)->where('status', $status)->count();
    }
}
