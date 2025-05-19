<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Content extends Model
{
    protected $fillable = [
        'section_id', 'content_type', 'content_data', 'order_num',
    ];

    //  Relationships
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function quiz(): HasOne
    {
        return $this->hasOne(Quiz::class);
    }

    public function file(): HasOne
    {
        return $this->hasOne(File::class);
    }

    // Helper method to get the full course path
    public function getCoursePath()
    {
        return $this->section->lesson->title . ' > ' . 
               $this->section->title . ' > ' . 
               $this->content_type;
    }
}
