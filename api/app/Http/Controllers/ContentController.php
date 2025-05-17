<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;

class ContentController
{
    public function index()
    {
        return Content::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'section_id' => 'required|exists:sections,id',
            'text' => 'required|string',
        ]);

        $content = Content::create($data);
        return response()->json($content, 201);
    }

    public function show($id)
    {
        return Content::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $content = Content::findOrFail($id);
        $content->update($request->all());
        return response()->json($content);
    }

    public function destroy($id)
    {
        $content = Content::findOrFail($id);
        $content->delete();
        return response()->json(null, 204);
    }
}
