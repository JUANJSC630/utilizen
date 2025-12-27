import { Clock, Lock, Shield, Sparkles } from 'lucide-react';

export default function ValueProposition() {
    const features = [
        {
            icon: Sparkles,
            title: '100% Gratis',
            description: 'Todas las herramientas para siempre',
        },
        {
            icon: Lock,
            title: 'Sin Login',
            description: 'Privacidad primero, sin registro',
        },
        {
            icon: Clock,
            title: 'Resultados Instantáneos',
            description: 'Genera código en < 1 segundo',
        },
        {
            icon: Shield,
            title: 'Código de Calidad',
            description: 'Best practices 2024 garantizadas',
        },
    ];

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                        Por Qué Desarrolladores Nos Eligen
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Herramientas profesionales sin compromisos
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div key={index} className="text-center">
                                {/* Icon */}
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                    <Icon className="h-10 w-10" />
                                </div>

                                {/* Title */}
                                <h3 className="mb-3 text-xl font-bold text-gray-900">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
