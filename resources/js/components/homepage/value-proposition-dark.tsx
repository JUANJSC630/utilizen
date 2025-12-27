import { Clock, Lock, Shield, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ValuePropositionDark() {
    const { t } = useTranslation();

    const features = [
        {
            icon: Sparkles,
            titleKey: 'valueProposition.features.free.title',
            descriptionKey: 'valueProposition.features.free.description',
        },
        {
            icon: Lock,
            titleKey: 'valueProposition.features.noLogin.title',
            descriptionKey: 'valueProposition.features.noLogin.description',
        },
        {
            icon: Clock,
            titleKey: 'valueProposition.features.instant.title',
            descriptionKey: 'valueProposition.features.instant.description',
        },
        {
            icon: Shield,
            titleKey: 'valueProposition.features.quality.title',
            descriptionKey: 'valueProposition.features.quality.description',
        },
    ];

    return (
        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-[var(--text-primary)]">
                        {t('valueProposition.title')}
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)]">
                        {t('valueProposition.subtitle')}
                    </p>
                </div>

                <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 transition-all hover:border-[var(--border-default)] hover:shadow-[var(--shadow-md)]"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--accent-primary)]">
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
                                {t(feature.titleKey)}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {t(feature.descriptionKey)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
