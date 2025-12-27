import PublicHeader from '@/components/public-header';
import { Head, Link } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function PublicLayout({
    children,
    title = 'UtiliZen - Professional Developer Tools',
    description = 'Professional online tools for web developers',
}: PublicLayoutProps) {
    const { t } = useTranslation();

    return (
        <div className="dark bg-[var(--bg-primary)]">
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>

            <PublicHeader />

            <main className="min-h-screen pt-16">{children}</main>

            <footer className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)]">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
                                {t('footer.sections.tools.title')}
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/tools/react-component-generator"
                                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                    >
                                        {t(
                                            'footer.sections.tools.links.componentGenerator',
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/tools/react-props-validator"
                                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                    >
                                        {t(
                                            'footer.sections.tools.links.propsValidator',
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/tools/react-performance-analyzer"
                                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                    >
                                        {t(
                                            'footer.sections.tools.links.performanceAnalyzer',
                                        )}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
                                {t('footer.sections.resources.title')}
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/blog"
                                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                    >
                                        {t(
                                            'footer.sections.resources.links.blog',
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/docs"
                                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                    >
                                        {t(
                                            'footer.sections.resources.links.documentation',
                                        )}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
                                {t('footer.sections.company.title')}
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                    >
                                        {t(
                                            'footer.sections.company.links.about',
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/pricing"
                                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                    >
                                        {t(
                                            'footer.sections.company.links.pricing',
                                        )}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
                                {t('footer.sections.legal.title')}
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                    >
                                        {t(
                                            'footer.sections.legal.links.privacy',
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                    >
                                        {t('footer.sections.legal.links.terms')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-[var(--border-default)] pt-8 text-center text-sm text-[var(--text-secondary)]">
                        {t('footer.copyright', {
                            year: new Date().getFullYear(),
                        })}
                    </div>
                </div>
            </footer>
        </div>
    );
}
