<?php

use App\Models\Tool;
use App\Models\ToolUsage;
use App\Models\User;

test('complete user journey tracking flow with all actions', function () {
    // Setup
    $user = User::factory()->create();
    $tool = Tool::factory()->create([
        'name' => 'React Component Generator',
        'slug' => 'react-component-generator',
        'usage_count' => 0,
    ]);

    ToolUsage::query()->delete();

    // Step 1: User visits the tool page (view action)
    $this->actingAs($user)
        ->postJson(route('api.usage.track'), [
            'tool_id' => $tool->id,
            'action' => 'view',
        ])
        ->assertOk()
        ->assertJson(['success' => true]);

    // Step 2: User generates code (generate action with metadata)
    $this->actingAs($user)
        ->postJson(route('api.usage.track'), [
            'tool_id' => $tool->id,
            'action' => 'generate',
            'metadata' => [
                'componentType' => 'functional',
                'hooksCount' => 2,
                'includeTypeScript' => true,
            ],
        ])
        ->assertOk();

    // Step 3: User copies the code (copy action)
    $this->actingAs($user)
        ->postJson(route('api.usage.track'), [
            'tool_id' => $tool->id,
            'action' => 'copy',
        ])
        ->assertOk();

    // Step 4: User downloads the code (download action)
    $this->actingAs($user)
        ->postJson(route('api.usage.track'), [
            'tool_id' => $tool->id,
            'action' => 'download',
        ])
        ->assertOk();

    // Process all queued jobs
    $this->artisan('queue:work --stop-when-empty');

    // Verify all 4 actions were tracked
    $usages = ToolUsage::where('user_id', $user->id)
        ->where('tool_id', $tool->id)
        ->orderBy('id')
        ->get();

    expect($usages)->toHaveCount(4);

    // Verify all have the same session_id and user_id
    expect($usages->pluck('session_id')->unique())->toHaveCount(1);
    expect($usages->pluck('user_id')->unique()->first())->toBe($user->id);

    // Verify actions in order
    expect($usages[0]->action)->toBe('view');
    expect($usages[1]->action)->toBe('generate');
    expect($usages[2]->action)->toBe('copy');
    expect($usages[3]->action)->toBe('download');

    // Verify metadata was stored for generate action
    expect($usages[1]->metadata)->toBe([
        'componentType' => 'functional',
        'hooksCount' => 2,
        'includeTypeScript' => true,
    ]);

    // Verify tool usage_count was incremented only once (for generate action)
    expect($tool->fresh()->usage_count)->toBe(1);
});

test('guest user journey is tracked without user_id but with consistent session', function () {
    $tool = Tool::factory()->create();
    ToolUsage::query()->delete();

    // Guest user actions
    $this->postJson(route('api.usage.track'), [
        'tool_id' => $tool->id,
        'action' => 'view',
    ])->assertOk();

    $this->postJson(route('api.usage.track'), [
        'tool_id' => $tool->id,
        'action' => 'generate',
    ])->assertOk();

    $this->postJson(route('api.usage.track'), [
        'tool_id' => $tool->id,
        'action' => 'copy',
    ])->assertOk();

    // Process jobs
    $this->artisan('queue:work --stop-when-empty');

    $usages = ToolUsage::where('tool_id', $tool->id)
        ->orderBy('id')
        ->get();

    expect($usages)->toHaveCount(3);

    // All should have same session_id but no user_id
    expect($usages->pluck('session_id')->unique())->toHaveCount(1);
    expect($usages->pluck('user_id')->unique()->first())->toBeNull();

    // Usage count should still increment
    expect($tool->fresh()->usage_count)->toBe(1);
});

test('ip address and user agent are tracked', function () {
    $user = User::factory()->create();
    $tool = Tool::factory()->create();
    ToolUsage::query()->delete();

    $this->actingAs($user)
        ->withHeader('User-Agent', 'Mozilla/5.0 Test Browser')
        ->postJson(route('api.usage.track'), [
            'tool_id' => $tool->id,
            'action' => 'view',
        ])
        ->assertOk();

    $this->artisan('queue:work --stop-when-empty');

    $usage = ToolUsage::latest()->first();

    expect($usage->ip_address)->not->toBeNull();
    expect($usage->user_agent)->toBe('Mozilla/5.0 Test Browser');
});
