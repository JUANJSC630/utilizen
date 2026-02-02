import AppLayout from '@/layouts/app-layout';
import AccountLayout from '@/layouts/account/layout';
import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Activity, Calendar, Search, Wrench } from 'lucide-react';
import { useState } from 'react';

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

interface UsageStats {
    total: number;
    thisMonth: number;
    thisWeek: number;
    byCategory: Record<string, number>;
    byTool: { name: string; count: number }[];
}

interface Props {
    usage: {
        data: ToolUsage[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: UsageStats;
    filters: {
        search?: string;
        category?: string;
        period?: string;
    };
    categories: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Account', href: '/account' },
    { title: 'Usage History', href: '/account/usage' },
];

function getActionBadge(action: string) {
    switch (action) {
        case 'generate':
            return <Badge variant="default">Generate</Badge>;
        case 'convert':
            return <Badge variant="secondary">Convert</Badge>;
        case 'validate':
            return <Badge variant="outline">Validate</Badge>;
        default:
            return <Badge variant="outline">{action}</Badge>;
    }
}

export default function AccountUsage({ usage, stats, filters, categories }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (key: string, value: string) => {
        router.get(
            '/account/usage',
            { ...filters, [key]: value || undefined },
            { preserveState: true }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter('search', search);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usage History" />
            <AccountLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Usage History"
                        description="Track your tool usage and activity over time."
                    />

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    This Week
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.thisWeek}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    This Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total All Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Tools Used
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.byTool.length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Tools */}
                    {stats.byTool.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Most Used Tools</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {stats.byTool.slice(0, 5).map((tool) => (
                                        <Badge
                                            key={tool.name}
                                            variant="secondary"
                                            className="text-sm"
                                        >
                                            {tool.name}: {tool.count}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Usage Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Activity Log</CardTitle>
                            </div>
                            <CardDescription>
                                Detailed history of your tool usage.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Filters */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <form onSubmit={handleSearch} className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search tools..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </form>
                                <Select
                                    value={filters.category || 'all'}
                                    onValueChange={(v) => handleFilter('category', v === 'all' ? '' : v)}
                                >
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.period || 'all'}
                                    onValueChange={(v) => handleFilter('period', v === 'all' ? '' : v)}
                                >
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Time</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="week">This Week</SelectItem>
                                        <SelectItem value="month">This Month</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Table */}
                            {usage.data.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tool</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Action</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {usage.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Link
                                                            href={`/tools/${item.tool.slug}`}
                                                            className="flex items-center gap-2 font-medium hover:underline"
                                                        >
                                                            <Wrench className="h-4 w-4 text-muted-foreground" />
                                                            {item.tool.name}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {item.tool.category}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getActionBadge(item.action)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(item.created_at).toLocaleString()}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    {usage.last_page > 1 && (
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                Showing {(usage.current_page - 1) * usage.per_page + 1} to{' '}
                                                {Math.min(usage.current_page * usage.per_page, usage.total)} of{' '}
                                                {usage.total} results
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={usage.current_page === 1}
                                                    onClick={() =>
                                                        router.get('/account/usage', {
                                                            ...filters,
                                                            page: usage.current_page - 1,
                                                        })
                                                    }
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={usage.current_page === usage.last_page}
                                                    onClick={() =>
                                                        router.get('/account/usage', {
                                                            ...filters,
                                                            page: usage.current_page + 1,
                                                        })
                                                    }
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-12 text-center">
                                    <Wrench className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                                    <h3 className="mt-4 text-lg font-semibold">No usage history</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        {filters.search || filters.category || filters.period
                                            ? 'No results match your filters.'
                                            : "Start using tools and your activity will appear here."}
                                    </p>
                                    {!filters.search && !filters.category && !filters.period && (
                                        <Button className="mt-4" asChild>
                                            <Link href="/tools">Browse Tools</Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AccountLayout>
        </AppLayout>
    );
}
