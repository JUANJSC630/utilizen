import AppLayout from '@/layouts/app-layout';
import AccountLayout from '@/layouts/account/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Calendar,
    CreditCard,
    Sparkles,
    Wrench,
} from 'lucide-react';

interface ToolUsage {
    id: number;
    action: string;
    created_at: string;
    tool: {
        id: number;
        name: string;
        slug: string;
        category: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    is_premium: boolean;
    premium_expires_at: string | null;
    api_calls_count: number;
    api_calls_limit: number;
}

interface Props {
    user: User;
    recentUsage: ToolUsage[];
    usageStats: {
        total: number;
        thisMonth: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Account', href: '/account' },
    { title: 'Overview', href: '/account/overview' },
];

export default function AccountOverview({
    user,
    recentUsage,
    usageStats,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Account" />
            <AccountLayout>
                <div className="space-y-6">
                    {/* Welcome Section */}
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Welcome back, {user.name}!
                        </h2>
                        <p className="text-muted-foreground">
                            Here's an overview of your account and recent
                            activity.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Current Plan
                                </CardTitle>
                                <Sparkles className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold">
                                        {user.is_premium ? 'Premium' : 'Free'}
                                    </span>
                                    <Badge
                                        variant={
                                            user.is_premium
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {user.is_premium ? 'Active' : 'Basic'}
                                    </Badge>
                                </div>
                                {user.is_premium && user.premium_expires_at && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Renews{' '}
                                        {new Date(
                                            user.premium_expires_at,
                                        ).toLocaleDateString()}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Tools Used This Month
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {usageStats.thisMonth}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {usageStats.total} total all time
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    API Calls
                                </CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {user.api_calls_count} /{' '}
                                    {user.api_calls_limit}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Resets monthly
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            <Button asChild variant="outline">
                                <Link href="/tools">
                                    <Wrench className="mr-2 h-4 w-4" />
                                    Browse Tools
                                </Link>
                            </Button>
                            {!user.is_premium && (
                                <Button asChild>
                                    <Link href="/pricing">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Upgrade to Premium
                                    </Link>
                                </Button>
                            )}
                            <Button asChild variant="outline">
                                <Link href="/account/subscription">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Manage Subscription
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Activity</CardTitle>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/account/usage">
                                    View All
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentUsage.length > 0 ? (
                                <div className="space-y-4">
                                    {recentUsage.map((usage) => (
                                        <div
                                            key={usage.id}
                                            className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-muted p-2">
                                                    <Wrench className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {usage.tool.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground capitalize">
                                                        {usage.action}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(
                                                    usage.created_at,
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Wrench className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                    <p>No recent activity</p>
                                    <Button asChild variant="link" className="mt-2">
                                        <Link href="/tools">
                                            Start using tools
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AccountLayout>
        </AppLayout>
    );
}
