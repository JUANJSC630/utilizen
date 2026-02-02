import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin/layout';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Activity, Crown, Edit, Plus, Search, Wrench } from 'lucide-react';
import { useState } from 'react';

interface Tool {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    is_active: boolean;
    is_premium: boolean;
    tool_usages_count: number;
    created_at: string;
}

interface Props {
    tools: {
        data: Tool[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        category?: string;
        is_active?: string;
        is_premium?: string;
    };
    categories: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Tools', href: '/admin/tools' },
];

export default function AdminToolsIndex({ tools, filters, categories }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (key: string, value: string) => {
        router.get(
            '/admin/tools',
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
            <Head title="Manage Tools" />
            <AdminLayout>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Wrench className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle>Tools</CardTitle>
                                </div>
                                <Button asChild>
                                    <Link href="/admin/tools/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Tool
                                    </Link>
                                </Button>
                            </div>
                            <CardDescription>
                                Manage tools, their settings, and SEO metadata.
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
                                    value={filters.is_active || 'all'}
                                    onValueChange={(v) => handleFilter('is_active', v === 'all' ? '' : v)}
                                >
                                    <SelectTrigger className="w-full sm:w-[130px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="true">Active</SelectItem>
                                        <SelectItem value="false">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.is_premium || 'all'}
                                    onValueChange={(v) => handleFilter('is_premium', v === 'all' ? '' : v)}
                                >
                                    <SelectTrigger className="w-full sm:w-[130px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="true">Premium</SelectItem>
                                        <SelectItem value="false">Free</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Table */}
                            {tools.data.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tool</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Usage</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tools.data.map((tool) => (
                                                <TableRow key={tool.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{tool.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                /{tool.slug}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{tool.category}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {tool.is_active ? (
                                                            <Badge variant="default" className="bg-green-500">
                                                                Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary">Inactive</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {tool.is_premium ? (
                                                            <Badge variant="default">
                                                                <Crown className="mr-1 h-3 w-3" />
                                                                Premium
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">Free</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Activity className="h-4 w-4" />
                                                            <span>{tool.tool_usages_count}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/admin/tools/${tool.id}`}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    {tools.last_page > 1 && (
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                Showing {(tools.current_page - 1) * tools.per_page + 1} to{' '}
                                                {Math.min(tools.current_page * tools.per_page, tools.total)} of{' '}
                                                {tools.total} tools
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={tools.current_page === 1}
                                                    onClick={() =>
                                                        router.get('/admin/tools', {
                                                            ...filters,
                                                            page: tools.current_page - 1,
                                                        })
                                                    }
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={tools.current_page === tools.last_page}
                                                    onClick={() =>
                                                        router.get('/admin/tools', {
                                                            ...filters,
                                                            page: tools.current_page + 1,
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
                                    <h3 className="mt-4 text-lg font-semibold">No tools found</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        {filters.search || filters.category || filters.is_active || filters.is_premium
                                            ? 'No tools match your filters.'
                                            : 'Create your first tool to get started.'}
                                    </p>
                                    <Button className="mt-4" asChild>
                                        <Link href="/admin/tools/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Tool
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
