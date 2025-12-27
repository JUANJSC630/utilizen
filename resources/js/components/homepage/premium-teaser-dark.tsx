import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PremiumTeaserDark() {
    const { t } = useTranslation();

    const features = [
        'premium.features.typescript',
        'premium.features.api',
        'premium.features.tests',
        'premium.features.support',
        'premium.features.noAds',
        'premium.features.noLimits',
    ];

    return (
        <section className="border-t border-[var(--border-subtle)] bg-gradient-to-br from-[#5E6AD2] to-[#7B89F4] py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl text-center text-white">
                    <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                        {t('premium.title')}
                    </h2>
                    <p className="mb-8 text-xl text-blue-100">
                        {t('premium.subtitle')}
                    </p>

                    <div className="mb-8 grid gap-4 text-left md:grid-cols-2">
                        {features.map((featureKey, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 rounded-lg bg-white/10 p-3 backdrop-blur"
                            >
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-300" />
                                <span className="text-lg">{t(featureKey)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6 text-2xl font-bold">
                        {t('premium.pricing')}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/pricing"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-bold text-purple-600 transition hover:bg-gray-100"
                        >
                            {t('premium.cta.primary')}
                        </Link>
                        <Link
                            href="/pricing"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-bold text-white transition hover:bg-white/10"
                        >
                            {t('premium.cta.secondary')}
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-blue-200">
                        {t('premium.note')}
                    </p>
                </div>
            </div>
        </section>
    );
}
