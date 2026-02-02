<?php

use App\Models\Tool;

beforeEach(function () {
    if (file_exists(public_path('sitemap.xml'))) {
        unlink(public_path('sitemap.xml'));
    }
});

afterEach(function () {
    if (file_exists(public_path('sitemap.xml'))) {
        unlink(public_path('sitemap.xml'));
    }
});

it('generates sitemap with homepage', function () {
    $this->artisan('sitemap:generate')->assertSuccessful();

    expect(file_exists(public_path('sitemap.xml')))->toBeTrue();

    $sitemap = file_get_contents(public_path('sitemap.xml'));
    expect($sitemap)->toContain('<loc>'.config('app.url').'</loc>');
});

it('generates sitemap with all active tools', function () {
    $activeTools = Tool::factory()->count(3)->create(['is_active' => true]);
    Tool::factory()->create(['is_active' => false]);

    $this->artisan('sitemap:generate')->assertSuccessful();

    $sitemap = file_get_contents(public_path('sitemap.xml'));

    foreach ($activeTools as $tool) {
        expect($sitemap)->toContain("/tools/{$tool->slug}");
    }
});

it('excludes inactive tools from sitemap', function () {
    $inactiveTool = Tool::factory()->create([
        'slug' => 'inactive-tool',
        'is_active' => false,
    ]);

    $this->artisan('sitemap:generate')->assertSuccessful();

    $sitemap = file_get_contents(public_path('sitemap.xml'));
    expect($sitemap)->not->toContain('inactive-tool');
});

it('includes correct priorities', function () {
    $this->artisan('sitemap:generate')->assertSuccessful();

    $sitemap = file_get_contents(public_path('sitemap.xml'));

    expect($sitemap)->toContain('<priority>1.0</priority>');
    expect($sitemap)->toContain('<priority>0.9</priority>');
});

it('includes tools index page', function () {
    $this->artisan('sitemap:generate')->assertSuccessful();

    $sitemap = file_get_contents(public_path('sitemap.xml'));
    expect($sitemap)->toContain('/tools</loc>');
});

it('includes static pages', function () {
    $this->artisan('sitemap:generate')->assertSuccessful();

    $sitemap = file_get_contents(public_path('sitemap.xml'));
    expect($sitemap)->toContain('/pricing</loc>');
    expect($sitemap)->toContain('/about</loc>');
    expect($sitemap)->toContain('/privacy</loc>');
    expect($sitemap)->toContain('/terms</loc>');
});

it('generates valid xml', function () {
    Tool::factory()->count(2)->create();

    $this->artisan('sitemap:generate')->assertSuccessful();

    $sitemap = file_get_contents(public_path('sitemap.xml'));
    $xml = simplexml_load_string($sitemap);

    expect($xml)->not->toBeFalse();
    expect($xml->getName())->toBe('urlset');
});
