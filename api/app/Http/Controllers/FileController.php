<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController 
{
    public function index()
    {
        return File::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'file' => 'required|file',
        ]);

        // Store the file on the local 'public' disk
        $path = $request->file('file')->store('files', 'public');

        $file = File::create([
            'lesson_id' => $data['lesson_id'],
            'path' => $path,
        ]);

        return response()->json($file, 201);
    }

    public function show($id)
    {
        $file = File::findOrFail($id);

        // Generate a public URL
        $file->url = asset('storage/' . $file->path);

        return response()->json($file);
    }

    public function update(Request $request, $id)
    {
        $file = File::findOrFail($id);

        if ($request->hasFile('file')) {
            // Delete old file
            Storage::disk('public')->delete($file->path);

            // Store new file
            $newPath = $request->file('file')->store('files', 'public');
            $file->path = $newPath;
        }

        if ($request->has('lesson_id')) {
            $request->validate([
                'lesson_id' => 'exists:lessons,id',
            ]);
            $file->lesson_id = $request->input('lesson_id');
        }

        $file->save();

        return response()->json($file);
    }

    public function destroy($id)
    {
        $file = File::findOrFail($id);

        // Delete from local disk
        Storage::disk('public')->delete($file->path);

        $file->delete();

        return response()->json(null, 204);
    }
}
