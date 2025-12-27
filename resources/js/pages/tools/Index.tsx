import ToolCard from '@/components/tools/tool-card';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Tool {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    is_premium: boolean;
    usage_count: number;
}

interface ToolsIndexProps {
    tools: Tool[];
}

export default function ToolsIndex({ tools }: ToolsIndexProps) {
    const { t } = useTranslation();
    const categories = [...new Set(tools.map((tool) => tool.category))];
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const getToolsByCategory = (category: string) =>
        tools.filter((tool) => tool.category === category);

    const scrollToCategory = (category: string) => {
        const element = document.getElementById(`category-${category}`);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
            setActiveCategory(category);
        }
    };

    const getCategoryLabel = (category: string) => {
        return category
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <PublicLayout
            title="All Tools - UtiliZen DevTools Suite"
            description="Browse our collection of professional online tools for React and web development"
        >
            <Head>
                <meta
                    property="og:title"
                    content="All Tools - UtiliZen DevTools Suite"
                />
                <meta
                    property="og:description"
                    content="Browse our collection of professional online tools for React and web development"
                />
            </Head>

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)]">
                        {t('tools.title')}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)]">
                        {t('tools.description')}
                    </p>
                </div>

                {/* Category Navigation */}
                <div className="sticky top-16 z-10 mb-8 bg-[var(--bg-primary)] py-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => scrollToCategory(category)}
                                className={`rounded-full px-6 py-2.5 text-xs font-medium transition-all duration-200 ${
                                    activeCategory === category
                                        ? 'scale-105 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                } `}
                            >
                                {getCategoryLabel(category)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tools Grid by Category */}
                <div className="space-y-12">
                    {categories.map((category) => (
                        <div
                            key={category}
                            id={`category-${category}`}
                            className="scroll-mt-32 p-12"
                        >
                            <h2 className="mb-6 text-2xl font-bold text-[var(--text-primary)] capitalize">
                                {getCategoryLabel(category)}
                            </h2>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {getToolsByCategory(category).map((tool) => (
                                    <ToolCard
                                        key={tool.id}
                                        name={tool.name}
                                        slug={tool.slug}
                                        description={tool.description}
                                        isPremium={tool.is_premium}
                                        usageCount={tool.usage_count}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] p-8 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-[var(--text-primary)]">
                        {t('tools.cta.title')}
                    </h2>
                    <p className="mb-6 text-[var(--text-secondary)]">
                        {t('tools.cta.description')}
                    </p>
                    <Link
                        href="/pricing"
                        className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700"
                    >
                        {t('tools.cta.button')}
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
