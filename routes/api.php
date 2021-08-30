<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\HotelServiceController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ConfigController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\LocationController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes();

Route::prefix('posts')->name('posts')->group(function () {
    Route::get('/', [PostController::class, 'getPostByType']);
});
Route::group(['middleware' => 'auth:api'], function () {
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::prefix('services')->name('services')->group(function () {
        Route::get('', [ServiceController::class, 'index'])->name('index');
        Route::get('/{id}', [ServiceController::class, 'show'])->name('show');
        Route::post('/', [ServiceController::class, 'store'])->name('store');
        Route::put('/{id}', [ServiceController::class, 'update'])->name('update');
        Route::delete('/', [ServiceController::class, 'delete'])->name('delete');
    });
    Route::prefix('posts')->name('posts')->group(function () {
        Route::get('/get-list', [PostController::class, 'index'])->name('index');
        Route::get('/{id}', [PostController::class, 'show'])->name('show');
        Route::post('', [PostController::class, 'storeOrUpdate'])->name('storeOrUpdate');
        Route::delete('/', [PostController::class, 'destroy'])->name('destroy');
        Route::post('/pages', [PostController::class, 'store'])->name('store');
        Route::put('/pages/{id}', [PostController::class, 'update'])->name('update');
    });
    Route::prefix('hotels')->name('hotels')->group(function () {
        Route::post('/', [HotelController::class, 'store'])->name('store');
        Route::delete('/', [HotelController::class, 'delete'])->name('delete');
        Route::put('/{id}', [HotelController::class, 'update'])->name('update');
        Route::prefix('/{id}')->group(function () {
            Route::apiResource('/rooms', RoomController::class);
            Route::put('/change-status', [HotelController::class, 'changeStatus'])->name('changeStatus');
        });
    });
    Route::prefix('files')->name('files')->group(function () {
        Route::post('', [FileController::class, 'store'])->name('store');
    });
    Route::prefix('users')->name('users')->group(function () {
        Route::put('/change-password', [UserController::class, 'changePassword'])->name('changePassword');
    });
    Route::prefix('bookings')->name('bookings')->group(function () {
        Route::get('', [BookingController::class, 'index'])->name('index');
    });
    Route::group(['middleware' => 'admin'], function () {
        Route::prefix('roles')->name('roles')->group(function () {
            Route::get('', [RoleController::class, 'index'])->name('index');
        });
        Route::prefix('users')->name('users')->group(function () {
            Route::get('', [UserController::class, 'index'])->name('index');
            Route::get('/{id}', [UserController::class, 'show'])->name('show');
            Route::post('', [UserController::class, 'store'])->name('store');
            Route::put('/{id}', [UserController::class, 'update'])->name('update');
            Route::delete('/', [UserController::class, 'delete'])->name('delete');
        });
        Route::prefix('configs')->name('configs')->group(function () {
            Route::get('', [ConfigController::class, 'index'])->name('index');
            Route::get('/{id}', [ConfigController::class, 'show'])->name('show');
            Route::post('', [ConfigController::class, 'store'])->name('store');
            Route::put('/{id}', [ConfigController::class, 'update'])->name('update');
            Route::delete('/', [ConfigController::class, 'delete'])->name('delete');
        });
    });
});

Route::prefix('locations')->name('locations')->group(function () {
    Route::get('', [LocationController::class, 'index'])->name('index');
});

Route::prefix('hotels')->name('hotels')->group(function () {
    Route::get('locations', [LocationController::class, 'showLocationHasHotel'])->name('showLocationHasHotel');
    Route::get('', [HotelController::class, 'index'])->name('index');
    Route::get('/{id}', [HotelController::class, 'show'])->name('show');
});

Route::prefix('bookings')->name('bookings')->group(function () {
    Route::post('/', [BookingController::class, 'store'])->name('store');
});
