import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FinalCTADark() {
    const { t } = useTranslation();

    return (
        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-16">
            <div className="container mx-auto px-4 text-center">
                <h3 className="mb-4 text-3xl font-bold text-[var(--text-primary)]">
                    {t('finalCta.title')}
                </h3>
                <p className="mb-8 text-lg text-[var(--text-secondary)]">
                    {t('finalCta.subtitle')}
                </p>
                <Link
                    href="/tools"
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-8 py-4 text-lg font-bold text-white shadow-[var(--shadow-xl)] transition-all hover:-translate-y-0.5 hover:scale-105 hover:bg-[var(--accent-hover)]"
                >
                    {t('finalCta.button')}
                    <ArrowRight className="h-6 w-6" />
                </Link>
            </div>
        </section>
    );
}
