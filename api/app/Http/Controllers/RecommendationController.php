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

    }

    public function index()
    {
        return Recommendation::with('lesson')->get();
    }

    public function store(Request $request)
    {
        Log::info('Received recommendation request:', ['request' => $request->all()]);

        try {
            $request->validate([
                'recommendations' => 'required|array',
                'recommendations.*.language' => 'required|string',
                'recommendations.*.score' => 'required|numeric',
                'recommendations.*.userId' => 'required|exists:users,id'
            ]);

            Log::info('Validation passed, processing recommendations');

            $createdRecs = [];

            foreach ($request->recommendations as $rec) {
                Log::info('Processing recommendation:', ['recommendation' => $rec]);
                
                // Search for lessons where the title contains the language string
                $lessons = Lesson::where('title', 'LIKE', '%' . $rec['language'] . '%')->get();
                Log::info('Found matching lessons:', ['count' => $lessons->count(), 'lessons' => $lessons->toArray()]);

                foreach ($lessons as $lesson) {
                    $created = Recommendation::create([
                        'user_id' => $rec['userId'],
                        'lesson_id' => $lesson->id,
                        'recommendation_score' => $rec['score']
                    ]);
                    $createdRecs[] = $created->id;
                    Log::info('Created recommendation:', ['id' => $created->id]);
                }
            }

            // Fetch created recommendations with lesson details
            $data = Recommendation::with('lesson')
                        ->whereIn('id', $createdRecs)
                        ->get();

            Log::info('Returning response:', ['data' => $data->toArray()]);

            return response()->json([
                'message' => 'Recommendations created successfully',
                'data' => $data
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error in recommendation creation:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error creating recommendations',
                'error' => $e->getMessage()
            ], 500);
        }
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
