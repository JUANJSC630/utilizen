<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tool extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'component_name',
        'category',
        'is_active',
        'is_premium',
        'usage_count',
        'view_count',
        'meta_title',
        'meta_description',
        'keywords',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_premium' => 'boolean',
            'usage_count' => 'integer',
            'view_count' => 'integer',
        ];
    }

    public function toolUsages(): HasMany
    {
        return $this->hasMany(ToolUsage::class);
    }

    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }

    public function incrementViews(): void
    {
        $this->increment('view_count');
    }
}
