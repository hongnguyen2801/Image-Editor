<?php
use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;

Route::get('/images', [ImageController::class, 'index']);
Route::post('/images', [ImageController::class, 'store']);
Route::delete('/images/{id}', [ImageController::class, 'destroy']);