import PublicLayout from '@/layouts/public-layout';
import { register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Check, Crown, X, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Pricing() {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;

    const plans = [
        {
            key: 'free',
            price: '$0',
            period: null,
            ctaLink: auth.user ? '/tools' : register(),
            highlighted: false,
        },
        {
            key: 'premium',
            price: t('pricing.plans.premium.price'),
            period: t('pricing.plans.premium.period'),
            ctaLink: auth.user ? '/dashboard' : register(),
            highlighted: true,
        },
        {
            key: 'team',
            price: t('pricing.plans.team.price'),
            period: t('pricing.plans.team.period'),
            ctaLink: 'mailto:sales@utilizen.com',
            highlighted: false,
        },
    ];

    return (
        <PublicLayout
            title="Pricing - UtiliZen"
            description="Choose the perfect plan for your React development needs. Start free or go premium for advanced features."
        >
            {/* Header */}
            <section className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)] bg-[var(--bg-tertiary)] px-4 py-2 text-sm font-medium text-[var(--accent-primary)]">
                        <Zap className="h-4 w-4" />
                        {t('pricing.badge')}
                    </div>

                    <h1 className="mb-6 text-5xl font-bold tracking-tight text-[var(--text-primary)]">
                        {t('pricing.title')}{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {t('pricing.titleHighlight')}
                        </span>
                    </h1>

                    <p className="text-xl text-[var(--text-secondary)]">
                        {t('pricing.description')}
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="px-4 pb-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.key}
                                className={`relative rounded-2xl border bg-[var(--bg-secondary)] p-8 ${
                                    plan.highlighted
                                        ? 'border-[var(--accent-primary)] shadow-xl ring-2 ring-[var(--accent-primary)]'
                                        : 'border-[var(--border-default)]'
                                }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-semibold text-white">
                                            <Crown className="h-4 w-4" />
                                            {t('pricing.mostPopular')}
                                        </div>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
                                        {t(`pricing.plans.${plan.key}.name`)}
                                    </h3>
                                    <p className="text-[var(--text-secondary)]">
                                        {t(
                                            `pricing.plans.${plan.key}.description`,
                                        )}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <span className="text-5xl font-bold text-[var(--text-primary)]">
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="text-[var(--text-secondary)]">
                                            {plan.period}
                                        </span>
                                    )}
                                </div>

                                <Link
                                    href={plan.ctaLink}
                                    className={`mb-6 block rounded-lg px-6 py-3 text-center font-semibold transition-all ${
                                        plan.highlighted
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                                    }`}
                                >
                                    {t(`pricing.plans.${plan.key}.cta`)}
                                </Link>

                                <div className="space-y-3">
                                    {/* Features */}
                                    {Object.keys(
                                        t(
                                            `pricing.plans.${plan.key}.features`,
                                            { returnObjects: true },
                                        ) as object,
                                    ).map((featureKey) => (
                                        <div
                                            key={featureKey}
                                            className="flex items-start gap-3"
                                        >
                                            <Check className="h-5 w-5 flex-shrink-0 text-[var(--success)]" />
                                            <span className="text-[var(--text-secondary)]">
                                                {t(
                                                    `pricing.plans.${plan.key}.features.${featureKey}`,
                                                )}
                                            </span>
                                        </div>
                                    ))}

                                    {/* Limitations (only for free plan) */}
                                    {plan.key === 'free' &&
                                        Object.keys(
                                            t(
                                                `pricing.plans.${plan.key}.limitations`,
                                                { returnObjects: true },
                                            ) as object,
                                        ).map((limitKey) => (
                                            <div
                                                key={limitKey}
                                                className="flex items-start gap-3 opacity-50"
                                            >
                                                <X className="h-5 w-5 flex-shrink-0 text-[var(--text-tertiary)]" />
                                                <span className="text-[var(--text-tertiary)]">
                                                    {t(
                                                        `pricing.plans.${plan.key}.limitations.${limitKey}`,
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-[var(--bg-secondary)] px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-12 text-center text-3xl font-bold text-[var(--text-primary)]">
                        {t('pricing.faq.title')}
                    </h2>

                    <div className="space-y-6">
                        {['trial', 'change', 'payment', 'refund'].map(
                            (questionKey) => (
                                <div key={questionKey}>
                                    <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
                                        {t(
                                            `pricing.faq.questions.${questionKey}.question`,
                                        )}
                                    </h3>
                                    <p className="text-[var(--text-secondary)]">
                                        {t(
                                            `pricing.faq.questions.${questionKey}.answer`,
                                        )}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
