import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Stats {
    total_developers: number;
    total_components_generated: number;
    satisfaction_rate: number;
}

interface SocialProofDarkProps {
    stats: Stats;
}

export default function SocialProofDark({ stats }: SocialProofDarkProps) {
    const { t } = useTranslation();

    const testimonials = [
        {
            nameKey: 'socialProof.testimonials.carlos.name',
            roleKey: 'socialProof.testimonials.carlos.role',
            companyKey: 'socialProof.testimonials.carlos.company',
            textKey: 'socialProof.testimonials.carlos.text',
        },
        {
            nameKey: 'socialProof.testimonials.ana.name',
            roleKey: 'socialProof.testimonials.ana.role',
            companyKey: 'socialProof.testimonials.ana.company',
            textKey: 'socialProof.testimonials.ana.text',
        },
        {
            nameKey: 'socialProof.testimonials.luis.name',
            roleKey: 'socialProof.testimonials.luis.role',
            companyKey: 'socialProof.testimonials.luis.company',
            textKey: 'socialProof.testimonials.luis.text',
        },
    ];

    return (
        <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-[var(--text-primary)]">
                        {t('socialProof.title')}
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)]">
                        {t('socialProof.subtitle')}
                    </p>
                </div>

                <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6"
                        >
                            <div className="mb-4 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]"
                                    />
                                ))}
                            </div>
                            <p className="mb-4 text-[var(--text-secondary)]">
                                "{t(testimonial.textKey)}"
                            </p>
                            <div>
                                <div className="font-semibold text-[var(--text-primary)]">
                                    {t(testimonial.nameKey)}
                                </div>
                                <div className="text-sm text-[var(--text-tertiary)]">
                                    {t(testimonial.roleKey)} @{' '}
                                    {t(testimonial.companyKey)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mx-auto grid max-w-4xl gap-8 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] p-8 md:grid-cols-3">
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-[var(--accent-primary)]">
                            {stats.total_developers.toLocaleString()}+
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                            {t('socialProof.stats.developers')}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-[var(--accent-primary)]">
                            {stats.total_components_generated.toLocaleString()}+
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                            {t('socialProof.stats.components')}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-[var(--accent-primary)]">
                            {stats.satisfaction_rate}%
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                            {t('socialProof.stats.satisfaction')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
