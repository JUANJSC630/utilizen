import { Link } from '@inertiajs/react';
import { ArrowRight, Code2, Sparkles, TrendingUp } from 'lucide-react';

interface Tool {
    id: number;
    name: string;
    slug: string;
    description: string;
    usage_count: number;
    category: string;
}

interface FeaturedToolsProps {
    tools: Tool[];
}

const categoryIcons: Record<string, any> = {
    'react-tools': Code2,
    'code-generators': Sparkles,
    utilities: TrendingUp,
};

export default function FeaturedTools({ tools }: FeaturedToolsProps) {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
                        🔥 MÁS POPULARES
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
                        Herramientas Más Utilizadas
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                        Las favoritas de la comunidad - probadas y usadas por
                        miles de desarrolladores cada día
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tools.map((tool, index) => {
                        const Icon = categoryIcons[tool.category] || Code2;
                        const isTopTool = index === 0;

                        return (
                            <Link
                                key={tool.id}
                                href={`/tools/${tool.slug}`}
                                className="group relative transform overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                {/* Popular badge for #1 tool */}
                                {isTopTool && (
                                    <div className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                        #1 Popular
                                    </div>
                                )}

                                {/* Icon */}
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                    <Icon className="h-8 w-8" />
                                </div>

                                {/* Title */}
                                <h3 className="mb-3 text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                                    {tool.name}
                                </h3>

                                {/* Description */}
                                <p className="mb-6 line-clamp-2 text-gray-600">
                                    {tool.description}
                                </p>

                                {/* Stats & CTA */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                                            {(tool.usage_count / 1000).toFixed(
                                                1,
                                            )}
                                            K+ usos
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-semibold text-yellow-500">
                                            ⭐ 4.9
                                        </div>
                                    </div>
                                </div>

                                {/* Hover CTA */}
                                <div className="mt-6 flex items-center gap-2 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                                    <span className="font-bold">
                                        Probar Ahora
                                    </span>
                                    <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                                </div>

                                {/* Gradient border on hover */}
                                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
                            </Link>
                        );
                    })}
                </div>

                {/* View All Link */}
                <div className="mt-12 text-center">
                    <Link
                        href="/tools"
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-bold text-gray-900 transition hover:bg-gray-200"
                    >
                        Ver Todas las Herramientas
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
