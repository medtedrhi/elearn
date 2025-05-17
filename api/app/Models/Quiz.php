<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    protected $fillable = [
        'content_id', 'title', 'instructions',
    ];

    //  Relationships
    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
