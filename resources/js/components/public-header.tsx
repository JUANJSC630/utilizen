import LanguageToggle from '@/components/language-toggle';
import UtilizenLogo from '@/components/utilizen-logo';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface PublicHeaderProps {
    className?: string;
}

export default function PublicHeader({ className = '' }: PublicHeaderProps) {
    const { t } = useTranslation();

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-50 h-16 animate-[slideInDown_0.6s_ease_forwards] border-b border-[rgba(64,64,64,0.3)] bg-[rgba(13,13,13,0.7)] backdrop-blur-lg ${className}`}
        >
            <div className="container mx-auto flex h-full items-center justify-between px-12">
                <UtilizenLogo />

                <div className="flex items-center gap-6">
                    <nav className="flex gap-8">
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
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                        >
                            {t('nav.dashboard')}
                        </Link>
                    </nav>
                    <LanguageToggle />
                </div>
            </div>
        </header>
    );
}
