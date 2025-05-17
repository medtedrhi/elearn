<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController
{
    public function index()
    {
        return Lesson::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $lesson = Lesson::create($data);
        return response()->json($lesson, 201);
    }

    public function show($id)
    {
        return Lesson::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->update($request->all());
        return response()->json($lesson);
    }

    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();
        return response()->json(null, 204);
    }
}

