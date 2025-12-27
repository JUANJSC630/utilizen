import AllToolsGridDark from '@/components/homepage/all-tools-grid-dark';
import FinalCTADark from '@/components/homepage/final-cta-dark';
import PremiumTeaserDark from '@/components/homepage/premium-teaser-dark';
import SocialProofDark from '@/components/homepage/social-proof-dark';
import ValuePropositionDark from '@/components/homepage/value-proposition-dark';
import LoadingScreen from '@/components/loading-screen';
import { Planet3DScene } from '@/components/planet-3d';
import PublicHeader from '@/components/public-header';
import { Head, Link } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Tool {
    id: number;
    name: string;
    slug: string;
    description: string;
    usage_count: number;
    category: string;
    is_premium: boolean;
}

interface Stats {
    total_developers: number;
    total_components_generated: number;
    satisfaction_rate: number;
    total_tools: number;
}

interface WelcomeProps {
    featuredTools: Tool[];
    allTools: Tool[];
    toolsByCategory: Record<string, Tool[]>;
    stats: Stats;
    canRegister: boolean;
}

export default function Welcome({ allTools, stats }: WelcomeProps) {
    const { t } = useTranslation();
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [showUI, setShowUI] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (loadingComplete) {
            setTimeout(() => {
                setShowUI(true);
            }, 2500);
        }
    }, [loadingComplete]);

    return (
        <div className="dark bg-[var(--bg-primary)]">
            <Head>
                <title>
                    UtiliZen - Professional Developer Tools | Dark Mode
                </title>
                <meta
                    name="description"
                    content="Free professional tools for modern web development. React components, code validation, performance analysis."
                />
            </Head>

            {!loadingComplete && (
                <LoadingScreen
                    onComplete={() => setLoadingComplete(true)}
                    duration={1000}
                />
            )}

            {loadingComplete && (
                <>
                    {/* HERO SECTION WITH 3D PLANET */}
                    <section className="relative h-screen w-full overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <Canvas
                                camera={{ position: [0, 0, 5], fov: 45 }}
                                className="animate-[fadeInCanvas_1s_ease_0.5s_forwards] opacity-0"
                            >
                                <Planet3DScene mousePosition={mousePosition} />
                            </Canvas>
                        </div>

                        <div
                            className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-800 ${
                                showUI ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <div className="pointer-events-auto">
                                <PublicHeader className="pointer-events-auto" />

                                <div className="flex h-screen items-center justify-center px-6 pt-16">
                                    <div className="max-w-4xl animate-[slideInUp_0.8s_ease_0.5s_both] rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)]/80 p-8 text-center shadow-lg">
                                        <h1 className="mb-5 text-5xl leading-tight font-bold text-[var(--text-primary)] md:text-6xl lg:text-7xl">
                                            {t('hero.title')}
                                            <br />
                                            <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                                                {t('hero.subtitle')}
                                            </span>
                                        </h1>

                                        <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-[var(--text-secondary)]">
                                            {t('hero.description')}
                                        </p>

                                        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                                            <Link
                                                href="/tools/react-component-generator"
                                                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-xl"
                                            >
                                                {t('hero.cta.primary')}
                                                <ArrowRight className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href="/tools"
                                                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-8 py-4 text-lg font-bold text-[var(--text-primary)] transition-all hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
                                            >
                                                {t('hero.cta.secondary')}
                                            </Link>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-secondary)]">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                                                <span>
                                                    {stats.total_developers.toLocaleString()}
                                                    +{' '}
                                                    {t(
                                                        'hero.badges.developers',
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                                                <span>
                                                    {t('hero.badges.free')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                                                <span>
                                                    {t('hero.badges.noLogin')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SCROLLABLE CONTENT SECTIONS */}
                    <div
                        className={`transition-opacity duration-800 ${
                            showUI ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <ValuePropositionDark />
                        <SocialProofDark stats={stats} />
                        <AllToolsGridDark tools={allTools} stats={stats} />
                        <PremiumTeaserDark />
                        <FinalCTADark />
                    </div>
                </>
            )}
        </div>
    );
}
