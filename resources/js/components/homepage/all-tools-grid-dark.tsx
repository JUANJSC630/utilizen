import { Link } from '@inertiajs/react';
import { ArrowRight, Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Tool {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
}

interface Stats {
    total_tools: number;
}

interface AllToolsGridDarkProps {
    tools: Tool[];
    stats: Stats;
}

export default function AllToolsGridDark({
    tools,
    stats,
}: AllToolsGridDarkProps) {
    const { t } = useTranslation();

    return (
        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
                        {t('allTools.title')}
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)]">
                        {stats.total_tools} {t('allTools.subtitle')}
                    </p>
                </div>

                <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {tools.map((tool) => (
                        <Link
                            key={tool.id}
                            href={`/tools/${tool.slug}`}
                            className="group rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 transition-all hover:-translate-y-1 hover:border-[var(--accent-primary)] hover:shadow-[var(--shadow-lg)]"
                        >
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-primary)]">
                                <Code2 className="h-5 w-5 text-white" />
                            </div>
                            <div className="mb-1 font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                                {tool.name}
                            </div>
                            <div className="text-sm text-[var(--text-tertiary)]">
                                {tool.category.replace('-', ' ')}
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/tools"
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-8 py-4 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-lg)]"
                    >
                        {t('allTools.cta', { count: stats.total_tools })}
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
