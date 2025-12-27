import { useMutation } from '@tanstack/react-query';

interface TrackingData {
    toolId: number;
    action: 'view' | 'generate' | 'copy' | 'download';
    metadata?: Record<string, any>;
}

interface TrackingResponse {
    success: boolean;
    message: string;
}

async function trackUsage(data: TrackingData): Promise<TrackingResponse> {
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const response = await fetch('/api/usage/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({
            tool_id: data.toolId,
            action: data.action,
            metadata: data.metadata,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to track usage');
    }

    return response.json();
}

export function useToolTracking() {
    const mutation = useMutation({
        mutationFn: trackUsage,
        onError: (error) => {
            // Silently fail - we don't want tracking errors to affect UX
            console.error('Failed to track usage:', error);
        },
    });

    return {
        track: mutation.mutate,
        trackAsync: mutation.mutateAsync,
        isTracking: mutation.isPending,
        error: mutation.error,
    };
}
