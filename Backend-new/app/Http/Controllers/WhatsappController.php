<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Whatsapp;
use App\Services\WhatsappService; // Import the WhatsappService
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;



class WhatsappController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'number' => 'required|string|max:255',
            'token' => 'required|string|max:255',
        ]);
        $whatsapp = new Whatsapp();
        $whatsapp->user_id = Auth::user()->id;
        $whatsapp->number = $request->number;
        //hash the token for security
        $whatsapp->token = Hash::make($request->token);
        $whatsapp->save();
        return response()->json([
            'message' => 'WhatsApp number and API token saved successfully.',
            'data' => $whatsapp,
        ], 201);
}

    public function update(Request $request)
    {
        $request->validate([
            'number' => 'required|string|max:255',
            'token' => 'required|string|max:255',
        ]);
        $user_id = Auth::user()->id;
        $whatsapp = Whatsapp::where('user_id', $user_id)->first();
        if (!$whatsapp) {
            return response()->json(['message' => 'WhatsApp not found'], 404);
        }
        $whatsapp->number = $request->number;
        $whatsapp->token = $request->token;
        $whatsapp->update();
        return response()->json([
            'message' => 'WhatsApp number and API token updated successfully.',
            'data' => $whatsapp,
        ], 200);
    }
    public function destroy($id)
    {
        $whatsapp = Whatsapp::find($id);
        if (!$whatsapp) {
            return response()->json(['message' => 'WhatsApp not found'], 404);
        }
        $whatsapp->delete();
        return response()->json(['message' => 'WhatsApp number and API token deleted successfully.'], 200);
    }
    public function index()
    {
        $whatsapp = Whatsapp::all();
        return response()->json($whatsapp, 200);
    }
    public function show()
    {
        $user_id = Auth::user()->id;
        $whatsapp = Whatsapp::where('user_id', $user_id)->first();
        if (!$whatsapp) {
            return response()->json(['message' => 'WhatsApp not found'], 404);
        }
        return response()->json($whatsapp, 200);
    }
    // public function sendMessage(Request $request, WhatsappService $whatsappService)
    // {
    //     $request->validate([
    //         'message' => 'required|string|max:255',
    //         'whatsapp_number' => 'required|string|max:255',
    //     ]);

    //     $whatsapp = Whatsapp::where('user_id', Auth::user()->id)->first();

    //     if (!$whatsapp) {
    //         return response()->json(['message' => 'WhatsApp not found'], 404);
    //     }

    //     $message = $request->input('message');
    //     $recipient = $request->input('whatsapp_number');
    //     $phoneNumberId = $whatsapp->number;
    //     $accessToken = $whatsapp->token;

    //     $response = $whatsappService->sendMessage($recipient, $message, $phoneNumberId, $accessToken);

    //     if ($response->successful()) {
    //         return response()->json(['message' => 'Message sent successfully.'], 200);
    //     } else {
    //         return response()->json(['message' => 'Failed to send message', 'error' => $response->json()], 500);
    //     }
    // }

    public function receiveMessage(Request $request)
    {
        // Here you would handle incoming messages from the WhatsApp API
        // For example, using a webhook to receive messages
        return response()->json(['message' => 'Message received successfully.'], 200);
    }
}
