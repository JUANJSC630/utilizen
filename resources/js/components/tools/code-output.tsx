import SyntaxHighlighter from '@/components/tools/syntax-highlighter';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CodeOutputProps {
    code: string;
    language?: string;
    filename?: string;
    onCopy?: () => void;
    onDownload?: () => void;
    showActions?: boolean;
}

export default function CodeOutput({
    code,
    language = 'jsx',
    filename = 'code.txt',
    onCopy,
    onDownload,
    showActions = true,
}: CodeOutputProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);

            // Call the tracking callback
            onCopy?.();

            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Call the tracking callback
        onDownload?.();
    };

    return (
        <div className="overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-tertiary)] px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    {filename && (
                        <span className="ml-2 text-sm font-medium text-[var(--text-primary)]">
                            {filename}
                        </span>
                    )}
                </div>

                {showActions && (
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="text-xs"
                        >
                            {copied ? (
                                <>
                                    <svg
                                        className="mr-1 h-3 w-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="mr-1 h-3 w-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Copy
                                </>
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="text-xs"
                        >
                            <svg
                                className="mr-1 h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            Download
                        </Button>
                    </div>
                )}
            </div>

            {/* Code Content */}
            <div className="overflow-x-auto bg-[var(--bg-primary)] p-4">
                <SyntaxHighlighter
                    code={code}
                    language={language}
                    className="text-sm leading-relaxed"
                />
            </div>
        </div>
    );
}
