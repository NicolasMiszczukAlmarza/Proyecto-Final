<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Cambia la URL de recuperación de contraseña al frontend
        ResetPassword::createUrlUsing(function ($notifiable, $token) {
            return "http://localhost:5173/reset-password?token=$token&email=" . urlencode($notifiable->email);
        });
    }
}
