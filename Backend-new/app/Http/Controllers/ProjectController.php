<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index(){
        // Fetch all projects
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $projects = Project::where('user_id', $user->id)->get();
        // dd($projects);

        return response()->json($projects);
    }

    public function store(){
        // Validate the request
        $validatedData = request()->validate([
            // 'user_id' => 'required|exists:users,id',
            'project_name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'objectives' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|string|max:255',
        ]);
        $user_id = Auth::user()->id;
        $validatedData['user_id'] = $user_id;
        // Create a new project
        $project = Project::create($validatedData);

        return response()->json($project, 201);
    }
    public function show($id){
        // Fetch a single project by ID
        $project = Project::findOrFail($id);

        return response()->json($project);
    }
    public function update(Request $request, $id){
        // Validate the request
        $validatedData = $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'project_name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:255',
            'objectives' => 'sometimes|required|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'status' => 'sometimes|required|string|max:255',
        ]);

        // Update the project
        $project = Project::findOrFail($id);
        $project->update($validatedData);

        return response()->json($project);
    }
    public function destroy($id){
        // Delete the project
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(null, 204);
    }
    public function getProjectByUserId($userId)
    {
        // Fetch projects by user ID
        $projects = Project::where('user_id', $userId)->get();

        return response()->json($projects);
    }
}
