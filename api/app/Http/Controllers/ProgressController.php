<?php

namespace App\Http\Controllers;

use App\Models\Progress;
use Illuminate\Http\Request;

class ProgressController
{
    public function index()
    {
        return Progress::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'lesson_id' => 'required|exists:lessons,id',
            'progress' => 'required|numeric|min:0|max:100',
        ]);

        $progress = Progress::create($data);
        return response()->json($progress, 201);
    }

    public function show($id)
    {
        return Progress::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $progress = Progress::findOrFail($id);
        $progress->update($request->all());
        return response()->json($progress);
    }

    public function destroy($id)
    {
        $progress = Progress::findOrFail($id);
        $progress->delete();
        return response()->json(null, 204);
    }
}
