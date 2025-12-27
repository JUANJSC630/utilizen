<?php

use App\Jobs\TrackToolUsage;
use App\Models\Tool;
use App\Models\ToolUsage;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

test('tracks tool usage with user_id for authenticated users via HTTP', function () {
    $user = User::factory()->create();
    $tool = Tool::factory()->create();

    // Clear existing records
    ToolUsage::query()->delete();

    $response = $this->actingAs($user)
        ->postJson(route('api.usage.track'), [
            'tool_id' => $tool->id,
            'action' => 'generate',
            'metadata' => ['test' => 'authenticated'],
        ]);

    $response->assertOk();

    // Wait for queue to process
    $this->artisan('queue:work --once');

    // Verify the record was created with user_id
    $usage = ToolUsage::latest()->first();

    expect($usage)->not->toBeNull();
    expect($usage->user_id)->toBe($user->id);
    expect($usage->tool_id)->toBe($tool->id);
    expect($usage->action)->toBe('generate');
});

test('session_id is consistent for same user across multiple requests', function () {
    $user = User::factory()->create();
    $tool = Tool::factory()->create();

    ToolUsage::query()->delete();

    // First request
    $response1 = $this->actingAs($user)
        ->postJson(route('api.usage.track'), [
            'tool_id' => $tool->id,
            'action' => 'view',
        ]);

    $response1->assertOk();

    // Second request with same session
    $response2 = $this->actingAs($user)
        ->postJson(route('api.usage.track'), [
            'tool_id' => $tool->id,
            'action' => 'generate',
        ]);

    $response2->assertOk();

    // Process the jobs
    $this->artisan('queue:work --stop-when-empty');

    // Verify both records have the same session_id
    $usages = ToolUsage::latest()->take(2)->get();

    expect($usages)->toHaveCount(2);
    expect($usages[0]->session_id)->toBe($usages[1]->session_id);
    expect($usages[0]->user_id)->toBe($user->id);
    expect($usages[1]->user_id)->toBe($user->id);
});

test('guest users have consistent session_id without user_id', function () {
    $tool = Tool::factory()->create();

    ToolUsage::query()->delete();

    // First request
    $response1 = $this->postJson(route('api.usage.track'), [
        'tool_id' => $tool->id,
        'action' => 'view',
    ]);

    $response1->assertOk();

    // Second request with same session
    $response2 = $this->postJson(route('api.usage.track'), [
        'tool_id' => $tool->id,
        'action' => 'generate',
    ]);

    $response2->assertOk();

    // Process the jobs
    $this->artisan('queue:work --stop-when-empty');

    // Verify both records have the same session_id but no user_id
    $usages = ToolUsage::latest()->take(2)->get();

    expect($usages)->toHaveCount(2);
    expect($usages[0]->session_id)->toBe($usages[1]->session_id);
    expect($usages[0]->user_id)->toBeNull();
    expect($usages[1]->user_id)->toBeNull();
});
