import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Crown,
    TrendingUp,
    Users,
    Wrench,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_premium: boolean;
    created_at: string;
}

interface PopularTool {
    tool_id: number;
    usage_count: number;
    tool: {
        id: number;
        name: string;
        slug: string;
        category: string;
    };
}

interface UsageByDay {
    date: string;
    count: number;
}

interface Props {
    userStats: {
        total: number;
        thisMonth: number;
        premium: number;
        admins: number;
    };
    toolStats: {
        total: number;
        active: number;
        premium: number;
    };
    usageStats: {
        total: number;
        thisMonth: number;
        thisWeek: number;
        today: number;
    };
    recentUsers: User[];
    popularTools: PopularTool[];
    usageByDay: UsageByDay[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Dashboard', href: '/admin/dashboard' },
];

export default function AdminDashboard({
    userStats,
    toolStats,
    usageStats,
    recentUsers,
    popularTools,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <AdminLayout>
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Users
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{userStats.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    +{userStats.thisMonth} this month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Premium Users
                                </CardTitle>
                                <Crown className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{userStats.premium}</div>
                                <p className="text-xs text-muted-foreground">
                                    {userStats.total > 0
                                        ? ((userStats.premium / userStats.total) * 100).toFixed(1)
                                        : 0}% of total users
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Tools
                                </CardTitle>
                                <Wrench className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{toolStats.active}</div>
                                <p className="text-xs text-muted-foreground">
                                    {toolStats.premium} premium tools
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Tool Usage Today
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{usageStats.today}</div>
                                <p className="text-xs text-muted-foreground">
                                    {usageStats.thisMonth} this month
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Recent Users */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Users</CardTitle>
                                    <CardDescription>
                                        Latest registered users
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/admin/users">
                                        View All
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                                    <span className="text-sm font-medium">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {user.is_premium && (
                                                    <Badge variant="default" className="text-xs">
                                                        <Crown className="mr-1 h-3 w-3" />
                                                        Premium
                                                    </Badge>
                                                )}
                                                {user.role === 'admin' && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Admin
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {recentUsers.length === 0 && (
                                        <p className="text-center text-sm text-muted-foreground py-4">
                                            No users yet
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Popular Tools */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Popular Tools</CardTitle>
                                    <CardDescription>
                                        Most used tools this month
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/admin/tools">
                                        View All
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {popularTools.map((item, index) => (
                                        <div
                                            key={item.tool_id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">
                                                        {item.tool.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.tool.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                                <span className="font-medium">
                                                    {item.usage_count}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {popularTools.length === 0 && (
                                        <p className="text-center text-sm text-muted-foreground py-4">
                                            No usage data yet
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href="/admin/users">
                                    <Users className="mr-2 h-4 w-4" />
                                    Manage Users
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/admin/tools">
                                    <Wrench className="mr-2 h-4 w-4" />
                                    Manage Tools
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/admin/tools/create">
                                    <ArrowUpRight className="mr-2 h-4 w-4" />
                                    Create New Tool
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
