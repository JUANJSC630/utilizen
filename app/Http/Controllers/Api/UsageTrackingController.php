<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\TrackToolUsage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UsageTrackingController extends Controller
{
    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tool_id' => 'required|exists:tools,id',
            'action' => 'required|in:view,generate,copy,download',
            'metadata' => 'nullable|array',
        ]);

        // Debug logging
        \Log::info('Usage Tracking Request', [
            'has_session' => $request->hasSession(),
            'user_id' => $request->user()?->id,
            'user_email' => $request->user()?->email,
            'session_id' => $request->session()->getId(),
            'tool_id' => $validated['tool_id'],
            'action' => $validated['action'],
        ]);

        // Get or create session ID
        if ($request->hasSession()) {
            $sessionId = $request->session()->get('session_id', function () use ($request) {
                $sessionId = Str::uuid()->toString();
                $request->session()->put('session_id', $sessionId);

                return $sessionId;
            });
        } else {
            // Fallback for API requests without session (e.g., in tests)
            $sessionId = Str::uuid()->toString();
        }

        TrackToolUsage::dispatch(
            toolId: $validated['tool_id'],
            userId: $request->user()?->id,
            sessionId: $sessionId,
            action: $validated['action'],
            metadata: $validated['metadata'] ?? [],
            ipAddress: $request->ip(),
            userAgent: $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'Usage tracked successfully',
            'debug' => [
                'user_id' => $request->user()?->id,
                'session_id' => $sessionId,
                'has_session' => $request->hasSession(),
            ],
        ]);
    }
}
