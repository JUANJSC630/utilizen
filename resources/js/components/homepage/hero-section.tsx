import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
    stats: {
        total_developers: number;
        total_components_generated: number;
        satisfaction_rate: number;
    };
}

export default function HeroSection({ stats }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 py-20 md:py-32">
            {/* Background pattern overlay */}
            <div className="bg-grid-white/[0.05] absolute inset-0 bg-[size:20px_20px]" />

            <div className="relative z-10 container mx-auto px-4">
                <div className="mx-auto max-w-5xl text-center">
                    {/* Headline */}
                    <h1 className="mb-6 text-4xl leading-tight font-extrabold text-white md:text-6xl lg:text-7xl">
                        Herramientas Gratis para
                        <br />
                        <span className="bg-gradient-to-r from-green-300 to-blue-200 bg-clip-text text-transparent">
                            Desarrolladores Web
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mx-auto mb-10 max-w-3xl text-xl text-blue-100 md:text-2xl">
                        Genera componentes React, valida código, analiza
                        rendimiento
                        <br className="hidden md:block" />
                        Todo gratis, sin registro
                    </p>

                    {/* CTAs */}
                    <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/tools"
                            className="transform rounded-lg bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105 hover:bg-green-600 hover:shadow-2xl"
                        >
                            Explorar Herramientas
                            <ArrowRight className="ml-2 inline h-5 w-5" />
                        </Link>

                        <Link
                            href="/tools/react-component-generator"
                            className="rounded-lg border-2 border-white bg-white/20 px-8 py-4 text-lg font-bold text-white backdrop-blur transition hover:bg-white/30"
                        >
                            Probar React Generator
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white md:gap-8 md:text-base">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-300" />
                            <span>
                                {stats.total_developers.toLocaleString()}+
                                Developers
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-300" />
                            <span>Sin Registro</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-300" />
                            <span>100% Gratis</span>
                        </div>
                    </div>
                </div>

                {/* Hero visual - Screenshot/GIF placeholder */}
                <div className="mx-auto mt-16 max-w-5xl">
                    <div className="overflow-hidden rounded-xl border-4 border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur">
                        <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 p-8">
                            {/* This would be replaced with actual screenshot or GIF */}
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                    <div className="mb-4 text-4xl">⚡</div>
                                    <div className="text-xl font-bold text-white">
                                        React Component Generator en Acción
                                    </div>
                                    <div className="mt-2 text-gray-400">
                                        Genera componentes profesionales en
                                        segundos
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom wave divider */}
            <div className="absolute right-0 bottom-0 left-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full"
                >
                    <path
                        d="M0 0L60 10C120 20 240 40 360 45C480 50 600 40 720 35C840 30 960 30 1080 35C1200 40 1320 50 1380 55L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
                        fill="white"
                    />
                </svg>
            </div>
        </section>
    );
}
