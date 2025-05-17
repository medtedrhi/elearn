<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'content_id', 'name', 'path', 'uploaded_at',
    ];

    protected $dates = ['uploaded_at'];

    //  Relationships
    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }
}
