<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users visiting dashboard are redirected to account overview', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertRedirect('/account/overview');
});

test('authenticated users can visit the account overview', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('account.overview'))->assertOk();
});
