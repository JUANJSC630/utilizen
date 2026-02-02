<?php

namespace App\Actions\Fortify;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): Response
    {
        // New users always go to account overview
        $redirectPath = '/account/overview';

        return $request->wantsJson()
            ? new JsonResponse(['redirect' => $redirectPath], 201)
            : redirect()->intended($redirectPath);
    }
}
