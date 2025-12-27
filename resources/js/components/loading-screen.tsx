import { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onComplete?: () => void;
    duration?: number;
}

export default function LoadingScreen({
    onComplete,
    duration = 1000,
}: LoadingScreenProps) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                onComplete?.();
            }, 800);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-800 ${
                fadeOut ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
        >
            <div className="mb-5 h-[50px] w-[50px]">
                <svg
                    className="h-full w-full animate-spin"
                    style={{ animation: 'rotate 2s linear infinite' }}
                    viewBox="0 0 50 50"
                >
                    <circle
                        className="stroke-current text-[#5E6AD2]"
                        style={{
                            animation: 'dash 1.5s ease-in-out infinite',
                            fill: 'none',
                            strokeWidth: 3,
                            strokeLinecap: 'round',
                        }}
                        cx="25"
                        cy="25"
                        r="20"
                    />
                </svg>
            </div>
            <p className="text-sm font-medium tracking-wide text-[#A3A3A3]">
                Loading...
            </p>
        </div>
    );
}
