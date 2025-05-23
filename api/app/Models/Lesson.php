<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    protected $fillable = [
        'title', 'description', 'difficulty', 'estimated_duration',
    ];

    //  Relationships
    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    public function recommendations(): HasMany
    {
        return $this->hasMany(Recommendation::class);
    }

    // Helper method to get course content
    public function getAllContent()
    {
        return $this->sections()
            ->with(['contents' => function ($query) {
                $query->orderBy('order_num');
            }])
            ->orderBy('order_num')
            ->get();
    }
}

