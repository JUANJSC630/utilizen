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
import { Crown, Eye, Search, Shield, Users } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_premium: boolean;
    email_verified_at: string | null;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        role?: string;
        is_premium?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Users', href: '/admin/users' },
];

export default function AdminUsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (key: string, value: string) => {
        router.get(
            '/admin/users',
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
            <Head title="Manage Users" />
            <AdminLayout>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Users</CardTitle>
                            </div>
                            <CardDescription>
                                Manage user accounts, roles, and permissions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Filters */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <form onSubmit={handleSearch} className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name or email..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </form>
                                <Select
                                    value={filters.role || 'all'}
                                    onValueChange={(v) => handleFilter('role', v === 'all' ? '' : v)}
                                >
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.is_premium || 'all'}
                                    onValueChange={(v) => handleFilter('is_premium', v === 'all' ? '' : v)}
                                >
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Plans</SelectItem>
                                        <SelectItem value="true">Premium</SelectItem>
                                        <SelectItem value="false">Free</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Table */}
                            {users.data.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Plan</TableHead>
                                                <TableHead>Verified</TableHead>
                                                <TableHead>Joined</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.data.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.role === 'admin' ? (
                                                            <Badge variant="secondary">
                                                                <Shield className="mr-1 h-3 w-3" />
                                                                Admin
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">User</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.is_premium ? (
                                                            <Badge variant="default">
                                                                <Crown className="mr-1 h-3 w-3" />
                                                                Premium
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary">Free</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.email_verified_at ? (
                                                            <Badge variant="outline" className="text-green-600">
                                                                Yes
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-amber-600">
                                                                No
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/admin/users/${user.id}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    {users.last_page > 1 && (
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                Showing {(users.current_page - 1) * users.per_page + 1} to{' '}
                                                {Math.min(users.current_page * users.per_page, users.total)} of{' '}
                                                {users.total} users
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={users.current_page === 1}
                                                    onClick={() =>
                                                        router.get('/admin/users', {
                                                            ...filters,
                                                            page: users.current_page - 1,
                                                        })
                                                    }
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={users.current_page === users.last_page}
                                                    onClick={() =>
                                                        router.get('/admin/users', {
                                                            ...filters,
                                                            page: users.current_page + 1,
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
                                    <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                                    <h3 className="mt-4 text-lg font-semibold">No users found</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        {filters.search || filters.role || filters.is_premium
                                            ? 'No users match your filters.'
                                            : 'No users have registered yet.'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
