import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    CreditCard,
    History,
    LayoutDashboard,
    Settings,
    Shield,
    Sparkles,
    User,
} from 'lucide-react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: '/account/overview',
        icon: LayoutDashboard,
    },
    {
        title: 'Profile',
        href: '/account/profile',
        icon: User,
    },
    {
        title: 'Security',
        href: '/account/security',
        icon: Shield,
    },
    {
        title: 'Subscription',
        href: '/account/subscription',
        icon: Sparkles,
    },
    {
        title: 'Billing',
        href: '/account/billing',
        icon: CreditCard,
    },
    {
        title: 'Usage History',
        href: '/account/usage',
        icon: History,
    },
    {
        title: 'Preferences',
        href: '/account/preferences',
        icon: Settings,
    },
];

export default function AccountLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();

    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading
                title={t('account.title', 'My Account')}
                description={t(
                    'account.description',
                    'Manage your account settings and preferences',
                )}
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
                                    'bg-muted': currentPath === item.href,
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

                    <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="w-full"
                    >
                        <Link href="/">Back to Site</Link>
                    </Button>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-3xl">
                    <section className="space-y-8">{children}</section>
                </div>
            </div>
        </div>
    );
}
