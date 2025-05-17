<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    protected $fillable = [
        'lesson_id', 'title', 'order_num',
    ];

    //  Relationships
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function contents(): HasMany
    {
        return $this->hasMany(Content::class);
    }
}
