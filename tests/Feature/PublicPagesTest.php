<?php

use App\Models\Tool;
use function Pest\Laravel\get;

test('pricing page renders successfully', function () {
    $response = get('/pricing');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('static/pricing')
    );
});

test('tools index page renders successfully', function () {
    // Create some test tools
    Tool::factory()->count(3)->create([
        'is_active' => true,
    ]);

    $response = get('/tools');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/Index')
        ->has('tools')
    );
});

test('react component generator tool page renders successfully', function () {
    $tool = Tool::factory()->create([
        'slug' => 'react-component-generator',
        'component_name' => 'ReactComponentGenerator',
        'is_active' => true,
    ]);

    $response = get("/tools/{$tool->slug}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tools/ReactComponentGenerator')
        ->has('tool')
    );
});

test('homepage renders successfully with UtiliZen branding', function () {
    $response = get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
    );
});

test('public pages use consistent layout', function () {
    // Create a test tool
    $tool = Tool::factory()->create([
        'slug' => 'react-component-generator',
        'component_name' => 'ReactComponentGenerator',
        'is_active' => true,
    ]);

    $pages = [
        '/pricing',
        '/tools',
        "/tools/{$tool->slug}",
    ];

    foreach ($pages as $page) {
        $response = get($page);
        $response->assertSuccessful();
    }
});
