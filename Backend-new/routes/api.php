<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\WhatsappController;
use App\Models\Whatsapp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/whatsapp',function (Request $request) {
    $whatsappDetails = Whatsapp::where('user_id', $request->user()->id)->first();
    if (!$whatsappDetails) {
        return response()->json(['message' => 'WhatsApp details not found'], 404);
    }

    $message = 'test message';
    $to = '+254798718682'; // Assuming 'to' is the recipient's phone number
    $phoneNumberId = $whatsappDetails->number; // Assuming 'number' is the phone number ID
    $token = $whatsappDetails->token; // Assuming 'token' is the access token

    $whatsappService = new \App\Services\WhatsAppService();
    // dd($whatsappService);
    $response = $whatsappService->sendMessage($to, $message, $phoneNumberId, $token// Assuming you have a way to get the access token
                );
    return response()->json($response);
})->middleware('auth:sanctum');

Route::post('/register', RegistrationController::class);
Route::post('/login', LoginController::class);
Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);

// Route::post('/reset-password', function (Request $request) {
//     $response = $request;
//     return response()->json($response);
// });

Route::middleware([
    'auth:sanctum',
])->group(function () {
    Route::prefix('projects')->controller(ProjectController::class)->group(function() {
        Route::get('/index', 'index')->name('projects.index');
        Route::post('/store', 'store')->name('projects.store');
        Route::post('/{project}/show', 'show')->name('projects.show');
        Route::post('/{project}/update', 'update')->name('projects.update');
        Route::delete('/{project}/destroy', 'destroy')->name('projects.destroy');
    });
    Route::prefix('tasks')->controller(TaskController::class)->group(function() {
        Route::get('/{projectId}/index', 'index')->name('tasks.index');
        Route::post('/store', 'store')->name('tasks.store');
        Route::post('/{task}/show', 'show')->name('tasks.show');
        Route::post('/{task}/update', 'update')->name('tasks.update');
        Route::delete('/{task}/destroy', 'destroy')->name('tasks.destroy');
        Route::get('/allTasks', 'allTasks')->name('tasks.allTasks');
        Route::post('/{taskId}/complete', 'completeTask')->name('tasks.complete');
    });
    Route::prefix('teams')->controller(TeamController::class)->group(function() {
        Route::get('/index', 'getAllTeams')->name('teams.index');
        Route::post('/store', 'createTeam')->name('teams.store');
        Route::post('/{id}/show', 'getTeamById')->name('teams.show');
        Route::post('/{id}/update', 'updateTeam')->name('teams.update');
        Route::delete('/{id}/destroy', 'deleteTeam')->name('teams.destroy');
    });
    Route::prefix('members')->controller(MemberController::class)->group(function() {
        Route::get('/allMembers', 'allMembers')->name('members.allMembers');
        Route::get('/{teamId}/index', 'index')->name('members.index');
        Route::post('/store', 'store')->name('members.store');
        Route::post('/{id}/show', 'show')->name('members.show');
        Route::post('/{id}/update', 'update')->name('members.update');
        Route::delete('/{id}/destroy', 'destroy')->name('members.destroy');
    });
    Route::prefix('whatsapp')->controller(WhatsappController::class)->group(function() {
        Route::get('/index', 'index')->name('whatsapp.index');
        Route::post('/store', 'store')->name('whatsapp.store');
        Route::get('/show', 'show')->name('whatsapp.show');
        Route::put('/update', 'update')->name('whatsapp.update');
        Route::delete('/{id}/destroy', 'destroy')->name('whatsapp.destroy');
    });

});
