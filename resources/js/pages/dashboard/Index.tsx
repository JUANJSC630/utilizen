import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, Calendar, Crown, TrendingUp } from 'lucide-react';

interface Tool {
    id: number;
    name: string;
    slug: string;
}

interface ToolUsage {
    id: number;
    action: string;
    created_at: string;
    tool: Tool;
}

interface FavoriteTool {
    tool_id: number;
    count: number;
    tool: Tool;
}

interface UsageStats {
    total_usage: number;
    this_month: number;
    favorite_tool: FavoriteTool | null;
}

interface Subscription {
    id: number;
    ends_at: string | null;
}

interface DashboardProps {
    recentUsage: ToolUsage[];
    usageStats: UsageStats;
    isPremium: boolean;
    subscription: Subscription | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    recentUsage,
    usageStats,
    isPremium,
    subscription,
}: DashboardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActionLabel = (action: string) => {
        const labels: Record<string, string> = {
            view: 'Viewed',
            generate: 'Generated',
            copy: 'Copied',
            download: 'Downloaded',
        };
        return labels[action] || action;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Track your tool usage and manage your account
                    </p>
                </div>

                {/* Premium Status */}
                {isPremium && (
                    <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6 dark:border-purple-800 dark:from-purple-950/50 dark:to-blue-950/50">
                        <div className="flex items-center gap-3">
                            <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            <div>
                                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                                    Premium Member
                                </h3>
                                <p className="text-sm text-purple-700 dark:text-purple-300">
                                    You have access to all premium features
                                    {subscription?.ends_at &&
                                        ` until ${formatDate(subscription.ends_at)}`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Total Usage */}
                    <div className="rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Usage
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {usageStats.total_usage}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-950">
                                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* This Month */}
                    <div className="rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    This Month
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {usageStats.this_month}
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-950">
                                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    {/* Favorite Tool */}
                    <div className="rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Favorite Tool
                                </p>
                                {usageStats.favorite_tool ? (
                                    <>
                                        <p className="mt-2 truncate text-lg font-semibold text-gray-900 dark:text-white">
                                            {usageStats.favorite_tool.tool.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {usageStats.favorite_tool.count}{' '}
                                            uses
                                        </p>
                                    </>
                                ) : (
                                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                                        No usage yet
                                    </p>
                                )}
                            </div>
                            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-950">
                                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-950">
                    <div className="border-b p-6 dark:border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Recent Activity
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Your latest tool interactions
                        </p>
                    </div>

                    <div className="divide-y dark:divide-gray-800">
                        {recentUsage.length > 0 ? (
                            recentUsage.map((usage) => (
                                <div
                                    key={usage.id}
                                    className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                            <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {getActionLabel(usage.action)}{' '}
                                                <Link
                                                    href={`/tools/${usage.tool.slug}`}
                                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    {usage.tool.name}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(usage.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-4 text-gray-500 dark:text-gray-400">
                                    No activity yet
                                </p>
                                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                                    Start using tools to see your activity here
                                </p>
                                <Link
                                    href="/tools"
                                    className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Browse Tools
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
