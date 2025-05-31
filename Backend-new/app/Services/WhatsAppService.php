<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    protected string $baseUrl;
    protected string $token;
    protected string $phoneNumberId;

    public function __construct()
    {
    }

    public function sendMessage(string $to, string $message, string $phoneNumberId, string $token)
    {
        $this->token = $token;
        $this->phoneNumberId = $phoneNumberId;
        $this->baseUrl = "https://graph.facebook.com/v17.0/{$phoneNumberId}";

        $response = Http::withToken($this->token)
            ->post("{$this->baseUrl}/messages", [
                'messaging_product' => 'whatsapp',
                'to'                => $to,
                'type'              => 'text',
                'text'              => ['body' => $message],
            ]);

        if (! $response->successful()) {
            throw new \Exception("WhatsApp send failed: {$response->body()}");
        }

        return $response;
    }
}
