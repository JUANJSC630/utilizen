<?php

use App\Models\Tool;

test('index displays all active tools', function () {
    $activeTools = Tool::factory()->count(3)->create();
    $inactiveTool = Tool::factory()->inactive()->create();

    $response = $this->get(route('tools.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/Index')
        ->has('tools', 3)
    );
});

test('index does not display inactive tools', function () {
    Tool::factory()->inactive()->count(2)->create();

    $response = $this->get(route('tools.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('tools', 0)
    );
});

test('show displays a specific tool', function () {
    $tool = Tool::factory()->create([
        'component_name' => 'ReactComponentGenerator',
    ]);

    $response = $this->get(route('tools.show', $tool->slug));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/ReactComponentGenerator')
        ->where('tool.id', $tool->id)
        ->where('tool.name', $tool->name)
        ->where('tool.slug', $tool->slug)
    );
});

test('show increments view count', function () {
    $tool = Tool::factory()->create(['view_count' => 0]);

    $this->get(route('tools.show', $tool->slug));

    expect($tool->fresh()->view_count)->toBe(1);
});

test('show returns 404 for inactive tools', function () {
    $tool = Tool::factory()->inactive()->create();

    $response = $this->get(route('tools.show', $tool->slug));

    $response->assertNotFound();
});

test('show returns 404 for non-existent tools', function () {
    $response = $this->get(route('tools.show', 'non-existent-tool'));

    $response->assertNotFound();
});

test('tools are cached on index', function () {
    Tool::factory()->count(2)->create();

    // First request - should cache
    $this->get(route('tools.index'))->assertOk();

    // Create a new tool
    Tool::factory()->create();

    // Second request - should use cache (only 2 tools)
    $response = $this->get(route('tools.index'));
    $response->assertInertia(fn ($page) => $page->has('tools', 2));
});

test('individual tools are cached on show', function () {
    $tool = Tool::factory()->create(['view_count' => 0]);

    // First request
    $this->get(route('tools.show', $tool->slug))->assertOk();
    expect($tool->fresh()->view_count)->toBe(1);

    // Second request - should use cache but still increment view
    $this->get(route('tools.show', $tool->slug))->assertOk();
    expect($tool->fresh()->view_count)->toBe(2);
});
