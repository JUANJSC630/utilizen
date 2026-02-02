import LanguageToggle from '@/components/language-toggle';
import UtilizenLogo from '@/components/utilizen-logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Settings, Shield, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PublicHeaderProps {
    className?: string;
}

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        } | null;
        isAdmin: boolean;
    };
}

export default function PublicHeader({ className = '' }: PublicHeaderProps) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const isAdmin = auth.isAdmin;

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-50 h-16 animate-[slideInDown_0.6s_ease_forwards] border-b border-[rgba(64,64,64,0.3)] bg-[rgba(13,13,13,0.7)] backdrop-blur-lg ${className}`}
        >
            <div className="container mx-auto flex h-full items-center justify-between px-12">
                <UtilizenLogo />

                <div className="flex items-center gap-6">
                    <nav className="flex items-center gap-8">
                        <Link
                            href="/tools"
                            className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                        >
                            {t('nav.tools')}
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                        >
                            {t('nav.pricing')}
                        </Link>

                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-1.5 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300"
                                    >
                                        <Shield className="h-4 w-4" />
                                        Admin
                                    </Link>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                                        <User className="h-4 w-4" />
                                        <span className="max-w-[120px] truncate">
                                            {user.name}
                                        </span>
                                        <ChevronDown className="h-3 w-3" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                    >
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/account"
                                                className="flex items-center gap-2"
                                            >
                                                <User className="h-4 w-4" />
                                                {t('nav.myAccount')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/account/preferences"
                                                className="flex items-center gap-2"
                                            >
                                                <Settings className="h-4 w-4" />
                                                {t('nav.settings')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="flex w-full items-center gap-2 text-red-400"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {t('nav.logout')}
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                >
                                    {t('nav.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-primary-hover)]"
                                >
                                    {t('nav.signUp')}
                                </Link>
                            </>
                        )}
                    </nav>
                    <LanguageToggle />
                </div>
            </div>
        </header>
    );
}
