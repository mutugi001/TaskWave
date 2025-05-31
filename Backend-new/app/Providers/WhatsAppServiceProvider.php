<?php

namespace App\Providers;

use App\Models\Whatsapp;
use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class WhatsAppServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(WhatsAppService::class, function ($app) {
            $user_id = Auth::user()->id;
            $whatsappConfig = Whatsapp::where('user_id', $user_id)->get();
            // $config = config('services.whatsapp');

            return new WhatsAppService(
                $whatsappConfig->number,
                $whatsappConfig->token,
                // $config['token'],
                // $config['phone_number_id']
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
