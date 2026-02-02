<?php

use App\Models\User;

beforeEach(function () {
    $this->adminUser = User::factory()->admin()->create();
    $this->regularUser = User::factory()->create();
});

describe('Admin Dashboard', function () {
    it('allows admin users to access the dashboard', function () {
        $response = $this->actingAs($this->adminUser)->get('/admin/dashboard');

        $response->assertOk();
    });

    it('denies regular users access to the dashboard', function () {
        $response = $this->actingAs($this->regularUser)->get('/admin/dashboard');

        $response->assertForbidden();
    });

    it('redirects guests to login', function () {
        $response = $this->get('/admin/dashboard');

        $response->assertRedirect('/login');
    });
});

describe('Admin Users Management', function () {
    it('allows admin users to view users list', function () {
        $response = $this->actingAs($this->adminUser)->get('/admin/users');

        $response->assertOk();
    });

    it('allows admin users to view a user', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($this->adminUser)->get("/admin/users/{$user->id}");

        $response->assertOk();
    });

    it('allows admin users to update a user', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($this->adminUser)->patch("/admin/users/{$user->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertRedirect();
        expect($user->fresh()->name)->toBe('Updated Name');
    });

    it('denies regular users access to users management', function () {
        $response = $this->actingAs($this->regularUser)->get('/admin/users');

        $response->assertForbidden();
    });
});

describe('Admin Tools Management', function () {
    it('allows admin users to view tools list', function () {
        $response = $this->actingAs($this->adminUser)->get('/admin/tools');

        $response->assertOk();
    });

    it('denies regular users access to tools management', function () {
        $response = $this->actingAs($this->regularUser)->get('/admin/tools');

        $response->assertForbidden();
    });
});
