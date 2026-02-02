<?php

use App\Models\Tool;

it('sets correct meta tags on homepage', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertSee('UtiliZen - Professional Developer Tools', false);
    $response->assertSee('Professional online tools for web developers', false);
});

it('sets tool-specific meta tags', function () {
    $tool = Tool::factory()->create([
        'slug' => 'test-tool',
        'meta_title' => 'Custom Tool Title',
        'meta_description' => 'Custom description for SEO',
    ]);

    $response = $this->get("/tools/{$tool->slug}");

    $response->assertOk();
    $response->assertSee('Custom Tool Title', false);
    $response->assertSee('Custom description for SEO', false);
});

it('sets noindex on auth pages', function () {
    $response = $this->get('/login');

    $response->assertOk();
    $response->assertSee('noindex,nofollow', false);
});

it('sets canonical URLs correctly', function () {
    $tool = Tool::factory()->create(['slug' => 'test-tool']);

    $response = $this->get("/tools/{$tool->slug}");

    $response->assertSee('rel="canonical"', false);
    $response->assertSee("/tools/{$tool->slug}", false);
});

it('includes open graph tags on homepage', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertSee('og:title', false);
    $response->assertSee('og:description', false);
    $response->assertSee('og:url', false);
});

it('includes twitter card tags on homepage', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertSee('twitter:card', false);
    $response->assertSee('twitter:title', false);
});

it('includes json-ld structured data on homepage', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertSee('application/ld+json', false);
    $response->assertSee('WebSite', false);
    $response->assertSee('SearchAction', false);
});

it('includes software application schema on tool pages', function () {
    $tool = Tool::factory()->create(['slug' => 'test-tool']);

    $response = $this->get("/tools/{$tool->slug}");

    $response->assertOk();
    $response->assertSee('SoftwareApplication', false);
    $response->assertSee('DeveloperApplication', false);
});

it('uses tool name and description as fallback when meta fields are null', function () {
    $tool = Tool::factory()->create([
        'name' => 'My Tool Name',
        'slug' => 'my-tool-name',
        'description' => 'My tool description',
        'meta_title' => null,
        'meta_description' => null,
    ]);

    $response = $this->get("/tools/{$tool->slug}");

    $response->assertOk();
    $response->assertSee('My Tool Name - UtiliZen', false);
    $response->assertSee('My tool description', false);
});

it('sets noindex on register page', function () {
    $response = $this->get('/register');

    $response->assertOk();
    $response->assertSee('noindex,nofollow', false);
});

it('sets noindex on account pages when authenticated', function () {
    $user = \App\Models\User::factory()->create();

    $response = $this->actingAs($user)->get('/account/overview');

    $response->assertOk();
    $response->assertSee('noindex,nofollow', false);
});

it('dashboard redirects authenticated users to account overview', function () {
    $user = \App\Models\User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertRedirect('/account/overview');
});
