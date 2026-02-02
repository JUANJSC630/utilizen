/**
 * Track custom events in Google Analytics
 */
export const trackEvent = (
    eventName: string,
    params?: Record<string, unknown>,
) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
};

/**
 * Track tool usage
 */
export const trackToolUsage = (toolName: string, toolCategory: string) => {
    trackEvent('tool_used', {
        tool_name: toolName,
        tool_category: toolCategory,
    });
};

/**
 * Track conversion events
 */
export const trackConversion = (conversionType: string, value?: number) => {
    trackEvent('conversion', {
        conversion_type: conversionType,
        value: value,
    });
};
