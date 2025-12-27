<?php

use App\Jobs\TrackToolUsage;
use App\Models\Tool;
use App\Models\ToolUsage;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

test('tracks tool usage for authenticated users', function () {
    Queue::fake();

    $user = User::factory()->create();
    $tool = Tool::factory()->create();

    $this->actingAs($user)
        ->postJson(route('api.usage.track'), [
            'tool_id' => $tool->id,
            'action' => 'generate',
            'metadata' => ['test' => 'data'],
        ])
        ->assertOk();

    Queue::assertPushed(TrackToolUsage::class);
});

test('tracks tool usage for guests with session id', function () {
    Queue::fake();

    $tool = Tool::factory()->create();

    $this->postJson(route('api.usage.track'), [
        'tool_id' => $tool->id,
        'action' => 'view',
    ])
        ->assertOk();

    Queue::assertPushed(TrackToolUsage::class);
});

test('validates required fields', function () {
    $this->postJson(route('api.usage.track'), [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['tool_id', 'action']);
});

test('validates action is one of allowed values', function () {
    $tool = Tool::factory()->create();

    $this->postJson(route('api.usage.track'), [
        'tool_id' => $tool->id,
        'action' => 'invalid-action',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['action']);
});

test('validates tool_id exists', function () {
    $this->postJson(route('api.usage.track'), [
        'tool_id' => 99999,
        'action' => 'view',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['tool_id']);
});

test('track tool usage job creates usage record', function () {
    $tool = Tool::factory()->create();
    $user = User::factory()->create();

    $job = new TrackToolUsage(
        toolId: $tool->id,
        userId: $user->id,
        sessionId: 'test-session-id',
        action: 'generate',
        metadata: ['component' => 'TestComponent'],
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent'
    );

    $job->handle();

    expect(ToolUsage::count())->toBe(1);

    $usage = ToolUsage::first();
    expect($usage->tool_id)->toBe($tool->id);
    expect($usage->user_id)->toBe($user->id);
    expect($usage->session_id)->toBe('test-session-id');
    expect($usage->action)->toBe('generate');
    expect($usage->metadata)->toBe(['component' => 'TestComponent']);
});

test('track tool usage job increments usage count for generate action', function () {
    $tool = Tool::factory()->create(['usage_count' => 5]);

    $job = new TrackToolUsage(
        toolId: $tool->id,
        userId: null,
        sessionId: 'test-session-id',
        action: 'generate'
    );

    $job->handle();

    expect($tool->fresh()->usage_count)->toBe(6);
});

test('track tool usage job does not increment usage count for other actions', function () {
    $tool = Tool::factory()->create(['usage_count' => 5]);

    $job = new TrackToolUsage(
        toolId: $tool->id,
        userId: null,
        sessionId: 'test-session-id',
        action: 'view'
    );

    $job->handle();

    expect($tool->fresh()->usage_count)->toBe(5);
});

test('metadata is optional', function () {
    Queue::fake();

    $tool = Tool::factory()->create();

    $this->postJson(route('api.usage.track'), [
        'tool_id' => $tool->id,
        'action' => 'copy',
    ])
        ->assertOk();

    Queue::assertPushed(TrackToolUsage::class);
});
