<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task; // Assuming Task model exists
use App\Models\Team;
use App\Models\Whatsapp;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    // Fetch all tasks
    public function index($projectId)
    {

        $project = Project::where('id', $projectId)->first();
        $tasks = Task::where('project_id', $project->id)->get();
        return response()->json($tasks, 200);
}
    public function allTasks()
    {
        $user = Auth::user();
        // Fetch all projects for the authenticated user
        // Assuming you have a relationship defined in the User model
        // to get the projects associated with the user
    $projects = Project::all()->where('user_id', $user->id);
        $tasks = [];
        foreach ($projects as $project) {
            $projectTasks = Task::where('project_id', $project->id)->get();
            foreach ($projectTasks as $task) {
                $tasks[] = $task;
            }
        }
        return response()->json($tasks, 200);

    }
    // Fetch a single task by ID
    public function show($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($task, 200);
    }

    // Create a new task
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'dependencies' => 'nullable|array',
            'dependencies.*' => 'exists:tasks,id',
            'status' => 'required|string|in:not_started,in_progress,review,completed,cancelled',
            'due_date' => 'required|date',
            'priority' => 'required|string|in:low,medium,high',
            'assigned_team' => 'required|exists:teams,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the task without dependencies
        $taskData = $request->except(['dependencies']);
        $task = Task::create($taskData);

        // Save dependencies if provided
        if ($request->has('dependencies') && is_array($request->dependencies)) {
            $task->dependencies()->sync($request->dependencies);
            foreach ($request->dependencies as $dependencyId) {
            $dependency = Task::find($dependencyId);
            //append the dependency to a new array
            if ($dependency) {
                $dependency_tasks_title[] = $dependency->title;
            } else {
                return response()->json(['message' => 'Dependency task not found'], 404);
            }
        }
        }




        $team = Team::find($request->assigned_team);
        $members = $team->members()->get();
        foreach($members as $member){
            $to = (string) $member->phone;
            $message =
                'Hello, you have been assigned a new task:' . "\n" .
                'Title: ' . $request->title . "\n" .
                'Description: ' . $request->description . "\n" .
                'Due Date: ' . $request->due_date . "\n" .
                'Priority: ' . $request->priority . "\n" .
                'Status: ' . $request->status . "\n" .
                'Assigned Team: ' . $team->team_name . "\n" .
                'depends_on: ' . implode(', ', $dependency_tasks_title?? []) . "\n" .
                'Please check your task list for more details.';
            try {
                $whatsappDetails = Whatsapp::where('user_id', Auth::user()->id)->first();
                if (!$whatsappDetails) {
                    return response()->json(['message' => 'WhatsApp configuration not found'], 404);
                }
                $whatsappService = new \App\Services\WhatsAppService();
                $response = $whatsappService->sendMessage($to, $message,
                    $whatsappDetails->number,
                    $whatsappDetails->token
                );
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
            }
        }

        return response()->json([$response, $task], 201);
    }

    // Update an existing task
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string|in:not_started,in_progress,review,completed,cancelled',
            'due_date' => 'sometimes|required|date',
            'priority' => 'sometimes|required|string|in:low,medium,high',
            'assigned_team' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $team = Team::find($request->assigned_team);
        $members = $team->members()->get();
        foreach($members as $member){
            $to = (string) $member->phone;
            $message =
                'Hello, you have been assigned a new task:' . "\n" .
                'Title: ' . $request->title . "\n" .
                'Description: ' . $request->description . "\n" .
                'Due Date: ' . $request->due_date . "\n" .
                'Priority: ' . $request->priority . "\n" .
                'Status: ' . $request->status . "\n" .
                'Assigned Team: ' . $team->team_name . "\n" .
                'depends_on: ' . implode(', ', $request->dependencies ?? []) . "\n" .
                'Please check your task list for more details.';
            try {
                $whatsappDetails = Whatsapp::where('user_id', Auth::user()->id)->first();
                if (!$whatsappDetails) {
                    return response()->json(['message' => 'WhatsApp configuration not found'], 404);
                }
                $whatsappService = new \App\Services\WhatsAppService();
                $response = $whatsappService->sendMessage($to, $message,
                    $whatsappDetails->number,
                    $whatsappDetails->token
                );
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
            }
        }

        $task->update($request->all());
        if ($request->has('dependencies') && is_array($request->dependencies)) {
            $task->dependencies()->sync($request->dependencies);
        }
        return response()->json($task, 200);
    }

    // Delete a task
    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->delete();
        // Also remove any dependencies associated with this task
        $task->dependencies()->detach();
        $task->dependents()->detach();
        return response()->json(['message' => 'Task deleted successfully'], 200);
    }
    // Complete a task
    public function completeTask($taskId)
    {
        $task = Task::find($taskId);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->status = 'completed';


        $task->save();
        // Notify the team members about the task completion
        $team = Team::find($task->assigned_team);
        $members = $team->members()->get();
        foreach($members as $member){
            $to = (string) $member->phone;
            $message =
                'Hello, a task has been completed:' . "\n" .
                'Title: ' . $task->title . "\n" .
                'Description: ' . $task->description . "\n" .
                'Due Date: ' . $task->due_date . "\n" .
                'Priority: ' . $task->priority . "\n" .
                'Status: ' . $task->status . "\n" .
                'Assigned Team: ' . $team->team_name . "\n" .
                'Please check your task list for more details.';
            try {
                $whatsappDetails = Whatsapp::where('user_id', Auth::user()->id)->first();
                if (!$whatsappDetails) {
                    return response()->json(['message' => 'WhatsApp configuration not found'], 404);
                }
                $whatsappService = new \App\Services\WhatsAppService();
                $response = $whatsappService->sendMessage($to, $message,
                    $whatsappDetails->number,
                    $whatsappDetails->token
                );
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
            }
        }
        //update the task's dependents status to 'in_progress'
        $dependents = $task->dependents;
        foreach ($dependents as $dependent) {
            //check if the dependent task has other dependencies
            $dependencies = $dependent->dependencies;
            if ($dependencies->count() > 0) {
                //if it has dependencies, check if all dependencies are completed
                $allCompleted = true;
                foreach ($dependencies as $dependency) {
                    if ($dependency->status !== 'completed') {
                        $allCompleted = false;
                        break;
                    }
                }
                //if all dependencies are completed, set the dependent task to 'in_progress'
                if ($allCompleted) {
                    $dependent->status = 'in_progress';
                }
            } else {
                //if no dependencies, set the dependent task to 'in_progress'
                $dependent->status = 'in_progress';
            }
            $dependent->save();

            $team = Team::find($dependent->assigned_team);
            $members = $team->members()->get();
            foreach($members as $member){
                $to = (string) $member->phone;
                $message =
                    'Hello, you have been assigned a new task:' . "\n" .
                    'Title: ' . $dependent->title . "\n" .
                    'Description: ' . $dependent->description . "\n" .
                    'Due Date: ' . $dependent->due_date . "\n" .
                    'Priority: ' . $dependent->priority . "\n" .
                    'Status: ' . $dependent->status . "\n" .
                    'Assigned Team: ' . $team->team_name . "\n" .
                    'Please check your task list for more details.';
                try {
                    $whatsappDetails = Whatsapp::where('user_id', Auth::user()->id)->first();
                    if (!$whatsappDetails) {
                        return response()->json(['message' => 'WhatsApp configuration not found'], 404);
                    }
                    $whatsappService = new \App\Services\WhatsAppService();
                    $response = $whatsappService->sendMessage($to, $message,
                        $whatsappDetails->number,
                        $whatsappDetails->token
                    );
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => 'error',
                        'message' => $e->getMessage(),
                    ], 500);
                }
        }
        }

        return response()->json(['message' => 'Task completed successfully'], 200);
    }
}
