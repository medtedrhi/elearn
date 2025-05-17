<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\AuthController;

Route::prefix('v1')->group(function () {
    // User routes
    Route::resource('users', UserController::class);

    // Lesson routes
    Route::resource('lessons', LessonController::class);

    // Section routes
    Route::resource('sections', SectionController::class);

    // Content routes
    Route::resource('contents', ContentController::class);

    // Quiz routes
    Route::resource('quizzes', QuizController::class);

    // Question routes
    Route::resource('questions', QuestionController::class);

    // File routes
    Route::resource('files', FileController::class);

    // Enrollment routes
    Route::resource('enrollments', EnrollmentController::class);

    // Progress routes
    Route::resource('progress', ProgressController::class);

    // Recommendation routes
    Route::resource('recommendations', RecommendationController::class);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile',     [AuthController::class, 'profile']);
    Route::post('/logout',[AuthController::class, 'logout']);
});
