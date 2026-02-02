<?php

namespace App\Actions\Fortify;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): Response
    {
        $user = $request->user();

        // Determine redirect path based on user role
        $redirectPath = $user->isAdmin()
            ? '/admin/dashboard'
            : '/account/overview';

        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false, 'redirect' => $redirectPath], 200)
            : redirect()->intended($redirectPath);
    }
}
