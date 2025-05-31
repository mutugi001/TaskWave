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
            'status' => 'required|string|in:not_started,in_progress,review,completed,cancelled',
            'due_date' => 'required|date',
            'priority' => 'required|string|in:low,medium,high',
            'assigned_team' => 'required|exists:teams,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $team = Team::find($request->assigned_team);
        $members = $team->members()->get();

        //fetch members of the assigned team from request->assigned_team
        foreach($members as $member){
            //use the members number to send them a whatsapp message
            $to = (string) $member->phone; // Convert the member's number to a string

            // Replace with the recipient's number
            $message =
            //edit the message to include the task details

            'Hello, you have been assigned a new task:' . "\n" .
            'Title: ' . $request->title . "\n" .
            'Description: ' . $request->description . "\n" .
            'Due Date: ' . $request->due_date . "\n" .
            'Priority: ' . $request->priority . "\n" .
            'Status: ' . $request->status . "\n" .
            'Assigned Team: ' . $team->team_name . "\n" .
            'Please check your task list for more details.'
            ; // Replace with your message
            try {
                $whatsappDetails = Whatsapp::where('user_id', Auth::user()->id)->first();
                if (!$whatsappDetails) {
                    return response()->json(['message' => 'WhatsApp configuration not found'], 404);
                }

                $whatsappService = new \App\Services\WhatsAppService();
                $response = $whatsappService->sendMessage($to, $message,
                    $whatsappDetails->number, // Assuming you have a way to get the phone number ID
                    $whatsappDetails->token// Assuming you have a way to get the access token
                );

                return response()->json([
                    'status' => 'success',
                    'response' => $response->json(),
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
            }
        }
        $task = Task::create($request->all());
        return response()->json($task, 201);
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

        $task->update($request->all());
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

        return response()->json(['message' => 'Task completed successfully'], 200);
    }
}
