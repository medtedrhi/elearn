<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    protected $fillable = [
        'quiz_id', 'question', 'op_a', 'op_b', 'op_c', 'op_d', 'correct_answer',
    ];

    // 🔗 Relationships
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }
}
