<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function() {
    return  view('Home');
})->middleware(['verify.shopify'])->name('home');