<?php

namespace App\Jobs;

use App\Models\Tool;
use App\Models\ToolUsage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;

class TrackToolUsage implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private int $toolId,
        private ?int $userId,
        private string $sessionId,
        private string $action,
        private array $metadata = [],
        private ?string $ipAddress = null,
        private ?string $userAgent = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        ToolUsage::create([
            'tool_id' => $this->toolId,
            'user_id' => $this->userId,
            'session_id' => $this->sessionId,
            'action' => $this->action,
            'metadata' => $this->metadata,
            'ip_address' => $this->ipAddress,
            'user_agent' => $this->userAgent,
        ]);

        if ($this->action === 'generate') {
            $tool = Tool::find($this->toolId);
            $tool?->incrementUsage();

            Cache::forget("tool_stats:{$this->toolId}:7days");
            Cache::forget('tools.popular');
        }
    }
}
