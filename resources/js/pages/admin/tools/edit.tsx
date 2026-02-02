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
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    ExternalLink,
    Search,
    Trash2,
} from 'lucide-react';

interface Tool {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    category: string;
    icon: string | null;
    component_name: string;
    is_active: boolean;
    is_premium: boolean;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    created_at: string;
    updated_at: string;
}

interface UsageStats {
    total: number;
    thisMonth: number;
    byDay: { date: string; count: number }[];
}

interface Props {
    tool: Tool;
    categories: string[];
    usageStats: UsageStats;
}

export default function AdminToolEdit({ tool, categories, usageStats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Tools', href: '/admin/tools' },
        { title: tool.name, href: `/admin/tools/${tool.id}` },
    ];

    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        short_description: tool.short_description || '',
        category: tool.category,
        icon: tool.icon || '',
        component_name: tool.component_name,
        is_active: tool.is_active,
        is_premium: tool.is_premium,
        seo_title: tool.seo_title || '',
        seo_description: tool.seo_description || '',
        seo_keywords: tool.seo_keywords || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/tools/${tool.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${tool.name}`} />
            <AdminLayout>
                <div className="space-y-6">
                    {/* Back Button */}
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/tools">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tools
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <a href={`/tools/${tool.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Tool
                            </a>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Usage
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{usageStats.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    This Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{usageStats.thisMonth}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    {tool.is_active ? (
                                        <Badge variant="default" className="bg-green-500">Active</Badge>
                                    ) : (
                                        <Badge variant="secondary">Inactive</Badge>
                                    )}
                                    {tool.is_premium && (
                                        <Badge variant="default">Premium</Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Core tool settings and identification.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="short_description">Short Description</Label>
                                    <Input
                                        id="short_description"
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                        placeholder="Brief description for cards and listings"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Full Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={data.category}
                                            onValueChange={(v) => setData('category', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="icon">Icon</Label>
                                        <Input
                                            id="icon"
                                            value={data.icon}
                                            onChange={(e) => setData('icon', e.target.value)}
                                            placeholder="e.g., Code, Wrench"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="component_name">Component Name</Label>
                                        <Input
                                            id="component_name"
                                            value={data.component_name}
                                            onChange={(e) => setData('component_name', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                                    <div className="flex items-center justify-between sm:flex-col sm:items-start">
                                        <div className="space-y-0.5">
                                            <Label>Active</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Tool is visible to users
                                            </p>
                                        </div>
                                        <Switch
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between sm:flex-col sm:items-start">
                                        <div className="space-y-0.5">
                                            <Label>Premium Only</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Requires premium subscription
                                            </p>
                                        </div>
                                        <Switch
                                            checked={data.is_premium}
                                            onCheckedChange={(checked) => setData('is_premium', checked)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO Settings */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle>SEO Settings</CardTitle>
                                </div>
                                <CardDescription>
                                    Search engine optimization metadata.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="seo_title">SEO Title</Label>
                                    <Input
                                        id="seo_title"
                                        value={data.seo_title}
                                        onChange={(e) => setData('seo_title', e.target.value)}
                                        placeholder="Custom title for search engines"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {data.seo_title?.length || 0}/60 characters
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="seo_description">SEO Description</Label>
                                    <Textarea
                                        id="seo_description"
                                        value={data.seo_description}
                                        onChange={(e) => setData('seo_description', e.target.value)}
                                        placeholder="Description for search results"
                                        rows={2}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {data.seo_description?.length || 0}/160 characters
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="seo_keywords">SEO Keywords</Label>
                                    <Input
                                        id="seo_keywords"
                                        value={data.seo_keywords}
                                        onChange={(e) => setData('seo_keywords', e.target.value)}
                                        placeholder="Comma-separated keywords"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
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

                    {/* Danger Zone */}
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible actions for this tool.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
                                        // router.delete would be here
                                    }
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Tool
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        </AppLayout>
    );
}
