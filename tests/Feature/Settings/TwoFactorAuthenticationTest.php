<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('security page renders two factor settings', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    $user = User::factory()->withoutTwoFactor()->create();

    $this->actingAs($user)
        ->get(route('account.security'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('account/security')
            ->where('twoFactorEnabled', false)
        );
});

test('old two factor settings route redirects to account security', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('two-factor.show'));

    $response->assertRedirect('/account/security');
});

test('security page shows two factor enabled status', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    $user = User::factory()->create();

    $user->forceFill([
        'two_factor_secret' => encrypt('test-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => now(),
    ])->save();

    $this->actingAs($user)
        ->get(route('account.security'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('account/security')
            ->where('twoFactorEnabled', true)
        );
});
