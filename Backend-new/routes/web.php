<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

//write a route that can be used to send a test whatsapp message
Route::get('/send-test-message', function () {
    $to = '+254798718682'; // Replace with the recipient's number
    $message = 'Hello from Laravel!'; // Replace with your message

    try {
        $whatsappService = app(\App\Services\WhatsAppService::class);
        $response = $whatsappService->sendMessage($to, $message,
            config('whatsapp.phone_number_id'), // Assuming you have a way to get the phone number ID
            config('whatsapp.access_token') // Assuming you have a way to get the access token
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
});

Route::get('/reset-password/{token}', function ($token) {
    // Redirect to the frontend reset password page with the token as a query parameter
    return redirect(config('app.frontend_url') . '/reset-password?token=' . $token);
})->name('password.reset');
