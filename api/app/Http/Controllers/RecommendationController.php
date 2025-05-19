<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class RecommendationController 
{
    public function __construct()
    {
        $this->middleware('api');
    }

    public function index()
    {
        return Recommendation::with('lesson')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'recommendations' => 'required|array',
            'recommendations.*.language' => 'required|string',
            'recommendations.*.score' => 'required|numeric',
            'recommendations.*.userId' => 'required|exists:users,id'
        ]);

        $recommendations = [];

        foreach ($request->recommendations as $rec) {
            // Find lessons matching the language
            $lessons = Lesson::where('title', 'LIKE', "%{$rec['language']}%")
                           ->orWhere('description', 'LIKE', "%{$rec['language']}%")
                           ->get();

            foreach ($lessons as $lesson) {
                $recommendations[] = Recommendation::create([
                    'user_id' => $rec['userId'],
                    'lesson_id' => $lesson->id,
                    'recommendation_score' => $rec['score']
                ]);
            }
        }

        return response()->json([
            'message' => 'Recommendations created successfully',
            'data' => $recommendations
        ], 201);
    }

    public function getUserRecommendations($userId)
    {
        $recommendations = Recommendation::with(['lesson' => function($query) {
                $query->with(['sections' => function($q) {
                    $q->orderBy('order_num')
                      ->with(['contents' => function($c) {
                          $c->orderBy('order_num');
                      }]);
                }]);
            }])
            ->where('user_id', $userId)
            ->orderBy('recommendation_score', 'desc')
            ->get();

        return response()->json([
            'message' => 'User recommendations retrieved successfully',
            'data' => $recommendations
        ]);
    }

    public function show($id)
    {
        try {
            $recommendation = Recommendation::with('lesson')->findOrFail($id);
            return response()->json($recommendation);
        } catch (\Exception $e) {
            Log::error('Error showing recommendation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error retrieving recommendation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $recommendation = Recommendation::findOrFail($id);
            $recommendation->update($request->all());
            return response()->json($recommendation);
        } catch (\Exception $e) {
            Log::error('Error updating recommendation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating recommendation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $recommendation = Recommendation::findOrFail($id);
            $recommendation->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Error deleting recommendation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting recommendation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
