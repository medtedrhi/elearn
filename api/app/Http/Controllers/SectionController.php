<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class SectionController
{
    public function index()
    {
        return Section::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'title' => 'required|string',
        ]);

        $section = Section::create($data);
        return response()->json($section, 201);
    }

    public function show($id)
    {
        return Section::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $section = Section::findOrFail($id);
        $section->update($request->all());
        return response()->json($section);
    }

    public function destroy($id)
    {
        $section = Section::findOrFail($id);
        $section->delete();
        return response()->json(null, 204);
    }
}
