import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BarChart3,
    LayoutDashboard,
    Settings,
    User,
    Users,
    Wrench,
} from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Tools',
        href: '/admin/tools',
        icon: Wrench,
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

export default function AdminLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading
                title="Admin Panel"
                description="Manage users, tools, and site settings"
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-56">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start gap-2', {
                                    'bg-muted': currentPath.startsWith(item.href),
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>

                    <Separator className="my-6" />

                    <div className="flex flex-col gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="w-full gap-2"
                        >
                            <Link href="/account/overview">
                                <User className="h-4 w-4" />
                                My Account
                            </Link>
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className="w-full"
                        >
                            <Link href="/">Back to Site</Link>
                        </Button>
                    </div>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1">
                    <section className="space-y-8">{children}</section>
                </div>
            </div>
        </div>
    );
}
