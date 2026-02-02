import { router } from '@inertiajs/react';
import { useEffect } from 'react';

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
    }
}

export default function GoogleAnalytics() {
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

    useEffect(() => {
        if (!gaId) {
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(...args: unknown[]) {
            window.dataLayer.push(args);
        }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', gaId);

        const removeListener = router.on('navigate', (event) => {
            gtag('config', gaId, {
                page_path: event.detail.page.url,
            });
        });

        return () => {
            removeListener();
            document.head.removeChild(script);
        };
    }, [gaId]);

    return null;
}
