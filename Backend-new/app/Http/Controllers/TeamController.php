<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    // Function to get all teams
    public function getAllTeams()
    {
        $teams = Team::where('user_id', Auth::user()->id)->get();
        return response()->json($teams, 200);
    }

    // Function to get a single team by ID
    public function getTeamById($id)
    {
        $team = Team::find('id', $id)->where('user_id', Auth::user()->id)->first();
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }
        return response()->json($team, 200);
    }

    // Function to create a new team
    public function createTeam(Request $request)
    {
        $validatedData = $request->validate([
            'team_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $user_id = Auth::user()->id;
        $validatedData['user_id'] = $user_id;
        $team = Team::create($validatedData);
        return response()->json($team, 201);
    }

    // Function to update an existing team
    public function updateTeam(Request $request, $id)
    {
        $team = \App\Models\Team::find($id);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $team->update($validatedData);
        return response()->json($team, 200);
    }

    // Function to delete a team
    public function deleteTeam($id)
    {
        $team = \App\Models\Team::find($id);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        $team->delete();
        return response()->json(['message' => 'Team deleted successfully'], 200);
    }
}
