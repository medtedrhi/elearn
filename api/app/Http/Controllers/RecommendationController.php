<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use Illuminate\Http\Request;

class RecommendationController
{
    public function index()
    {
        return Recommendation::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'lesson_id' => 'required|exists:lessons,id',
            'reason' => 'required|string',
        ]);

        $recommendation = Recommendation::create($data);
        return response()->json($recommendation, 201);
    }

    public function show($id)
    {
        return Recommendation::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $recommendation = Recommendation::findOrFail($id);
        $recommendation->update($request->all());
        return response()->json($recommendation);
    }

    public function destroy($id)
    {
        $recommendation = Recommendation::findOrFail($id);
        $recommendation->delete();
        return response()->json(null, 204);
    }
}
