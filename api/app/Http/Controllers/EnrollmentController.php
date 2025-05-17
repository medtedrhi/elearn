<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController
{
    public function index()
    {
        return Enrollment::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'lesson_id' => 'required|exists:lessons,id',
        ]);

        $enrollment = Enrollment::create($data);
        return response()->json($enrollment, 201);
    }

    public function show($id)
    {
        return Enrollment::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $enrollment = Enrollment::findOrFail($id);
        $enrollment->update($request->all());
        return response()->json($enrollment);
    }

    public function destroy($id)
    {
        $enrollment = Enrollment::findOrFail($id);
        $enrollment->delete();
        return response()->json(null, 204);
    }
}
