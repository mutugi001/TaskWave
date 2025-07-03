<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MemberController extends Controller
{
    public function allMembers()
    {
        $members = Member::where('user_id', Auth::user()->id)->get();
        // fetch teams associated with the members
        foreach ($members as $member) {
            $member->teams = $member->teams()->get();
        }
        return response()->json($members, 200);
    }

    // Fetch all members
    public function index($teamId)
    {
        // Fetch all members from the team with the given ID
        $team = Team::find($teamId);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        // Check if the authenticated user is the owner of the team
        if ($team->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Fetch members and their associated teams
        $members = $team->members()->with('teams')->get();
        return response()->json($members, 200);

        if ($members->isEmpty()) {
            return response()->json(['message' => 'No members found'], 404);
        }

        return response()->json($members, 200);
    }

    // Create a new member
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'phone' => 'required|string|max:20',
            'role' => 'nullable|string|in:Team Lead,Member',
            'profile_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048', // Expect a file upload
            'team_ids' => 'nullable|array',
            'team_ids.*' => 'exists:teams,id',
        ]);

        $user = Auth::user();
        $validatedData['user_id'] = $user->id;

        // Handle blob profile picture upload
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $imagePath = $file->store('profile_pictures', 'public'); // Store in 'storage/app/public/profile_pictures'
            // Save the correct URL for frontend access
            $validatedData['profile_picture'] = url('storage/' . $imagePath);
        }

        $member = Member::create($validatedData);

        if (isset($validatedData['team_ids'])) {
            $member->teams()->sync($validatedData['team_ids']); // Save multiple team associations
        }

        return response()->json($member->load('teams'), 201);
    }

    // Fetch a single member by ID
    public function show($id)
    {
        $member = Member::with('teams')->find($id);

        if (!$member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        return response()->json($member, 200);
    }

    // Update a member's details
    public function update(Request $request, $id)
    {
        $member = Member::find($id);

        if (!$member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:members,email,' . $id,
            'phone' => 'nullable|string|max:15',
            'role' => 'nullable|string|in:Team Lead,Member',
            'profile_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048', // Expect a file upload
            'team_ids' => 'sometimes|array',
            'team_ids.*' => 'exists:teams,id',
        ]);

        // Handle blob profile picture upload
        if ($request->hasFile('profilePhoto')) {
            $image = $request->file('profilePhoto');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('profile_photos'), $imageName);
            $validatedData['profilePhoto'] = url('profile_photos/' . $imageName);
        }

        $member->update($validatedData);

        if (isset($validatedData['team_ids'])) {
            $member->teams()->sync($validatedData['team_ids']); // Update team associations
        }

        return response()->json($member->load('teams'), 200);
    }

    // Delete a member
    public function destroy($id)
    {
        $member = Member::find($id);

        if (!$member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        // Delete the profile picture from storage
        if ($member->profile_picture) {
            $imagePath = str_replace(asset('storage/'), '', $member->profile_picture);
            Storage::disk('public')->delete($imagePath);
        }

        $member->teams()->detach();
        $member->delete();

        return response()->json(['message' => 'Member deleted successfully'], 200);
    }
}
