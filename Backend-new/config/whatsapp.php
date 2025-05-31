<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


try {
    $user_id = Auth::user()->id; // Assuming you have a way to get the authenticated user's ID
    $whatsappConfig = DB::table('whatsapps')->where('user_id', $user_id)->first(); // Replace 'whatsapp_configs' with your table name
    if ($whatsappConfig) {
        return [
            'phone_number_id' => $whatsappConfig->phone_number_id, // Replace with your actual column names
            'access_token' => $whatsappConfig->access_token,
            'webhook_verify_token' => $whatsappConfig->webhook_verify_token,
        ];
    }
} catch (\Exception $e) {
    // Handle database connection errors or table not found
    return [
        'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID', 'default_phone_number_id'),
        'access_token' => env('WHATSAPP_ACCESS_TOKEN', 'default_access_token'),
        'webhook_verify_token' => env('WHATSAPP_WEBHOOK_VERIFY_TOKEN', 'default_verify_token'),
    ];
}


return [
    'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID', 'default_phone_number_id'),
    'access_token' => env('WHATSAPP_ACCESS_TOKEN', 'default_access_token'),
    'webhook_verify_token' => env('WHATSAPP_WEBHOOK_VERIFY_TOKEN', 'default_verify_token'),
];

