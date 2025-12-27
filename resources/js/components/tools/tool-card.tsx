import { Link } from '@inertiajs/react';

interface ToolCardProps {
    name: string;
    slug: string;
    description: string;
    isPremium?: boolean;
    usageCount?: number;
}

export default function ToolCard({
    name,
    slug,
    description,
    isPremium = false,
    usageCount = 0,
}: ToolCardProps) {
    return (
        <Link
            href={`/tools/${slug}`}
            className="group relative overflow-hidden rounded-lg border bg-white p-6 transition hover:border-blue-500 hover:shadow-lg"
        >
            {isPremium && (
                <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white">
                        Premium
                    </span>
                </div>
            )}

            <div className="mb-3">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                    {name}
                </h3>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-gray-600">
                {description}
            </p>

            <div className="flex items-center justify-between">
                {usageCount > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                        <span>{usageCount.toLocaleString()} uses</span>
                    </div>
                )}

                <span className="ml-auto flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 group-hover:underline">
                    Use tool
                    <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </span>
            </div>
        </Link>
    );
}
