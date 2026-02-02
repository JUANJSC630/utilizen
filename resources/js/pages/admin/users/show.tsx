import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    Calendar,
    Crown,
    Mail,
    Shield,
    Trash2,
    User,
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

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    is_premium: boolean;
    premium_expires_at: string | null;
    api_calls_count: number;
    api_calls_limit: number;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    user: UserData;
    recentUsage: ToolUsage[];
    usageStats: {
        total: number;
        thisMonth: number;
    };
}

export default function AdminUserShow({ user, recentUsage, usageStats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Users', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}` },
    ];

    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        is_premium: user.is_premium,
        api_calls_limit: user.api_calls_limit,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/users/${user.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />
            <AdminLayout>
                <div className="space-y-6">
                    {/* Back Button */}
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>

                    {/* User Info Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {user.email}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {user.role === 'admin' && (
                                        <Badge variant="secondary">
                                            <Shield className="mr-1 h-3 w-3" />
                                            Admin
                                        </Badge>
                                    )}
                                    {user.is_premium && (
                                        <Badge variant="default">
                                            <Crown className="mr-1 h-3 w-3" />
                                            Premium
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 text-sm md:grid-cols-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Joined:</span>
                                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Total Usage:</span>
                                    <span>{usageStats.total}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">This Month:</span>
                                    <span>{usageStats.thisMonth}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Edit User Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit User</CardTitle>
                                <CardDescription>
                                    Update user information and permissions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(v) => setData('role', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="api_calls_limit">API Calls Limit</Label>
                                        <Input
                                            id="api_calls_limit"
                                            type="number"
                                            value={data.api_calls_limit}
                                            onChange={(e) =>
                                                setData('api_calls_limit', parseInt(e.target.value) || 0)
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Current usage: {user.api_calls_count} / {user.api_calls_limit}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Premium Status</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Grant premium access to this user
                                            </p>
                                        </div>
                                        <Switch
                                            checked={data.is_premium}
                                            onCheckedChange={(checked) => setData('is_premium', checked)}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center gap-4">
                                        <Button type="submit" disabled={processing}>
                                            Save Changes
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600">Saved.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Latest tool usage by this user.
                                </CardDescription>
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
                                                        <p className="font-medium">{usage.tool.name}</p>
                                                        <p className="text-sm text-muted-foreground capitalize">
                                                            {usage.action}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(usage.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        <Wrench className="mx-auto h-8 w-8 opacity-50" />
                                        <p className="mt-2">No activity yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Danger Zone */}
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible actions that affect this user account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                                        // router.delete would be here
                                    }
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
