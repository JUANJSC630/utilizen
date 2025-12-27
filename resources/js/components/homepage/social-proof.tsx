interface SocialProofProps {
    stats: {
        total_developers: number;
        total_components_generated: number;
        satisfaction_rate: number;
    };
}

export default function SocialProof({ stats }: SocialProofProps) {
    const testimonials = [
        {
            rating: 5,
            text: 'Me ahorra 2 horas cada día. Las herramientas son increíblemente rápidas y precisas.',
            author: 'Sarah K.',
            role: 'Sr Developer @Tech',
            avatar: '👩‍💻',
        },
        {
            rating: 5,
            text: 'Finalmente herramientas gratis que realmente funcionan. Sin trucos, sin límites escondidos.',
            author: 'Mike R.',
            role: 'Freelancer',
            avatar: '👨‍💻',
        },
        {
            rating: 5,
            text: 'Calidad de código excelente. Mis componentes ahora siguen best practices automáticamente.',
            author: 'David L.',
            role: 'Lead @Startup',
            avatar: '🧑‍💻',
        },
    ];

    return (
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                        Confiado por {stats.total_developers.toLocaleString()}+
                        Desarrolladores
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Miles de developers usan nuestras herramientas cada día
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="rounded-xl bg-white p-6 shadow-lg transition hover:shadow-xl"
                        >
                            {/* Stars */}
                            <div className="mb-4 flex gap-1 text-yellow-400">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-xl">
                                        ⭐
                                    </span>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="mb-4 text-gray-700">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">
                                        {testimonial.author}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Bar */}
                <div className="rounded-xl border-2 border-blue-200 bg-white p-8">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mb-2 text-4xl font-bold text-blue-600 md:text-5xl">
                                {stats.total_developers.toLocaleString()}+
                            </div>
                            <div className="text-gray-600">
                                📊 Developers Activos
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="mb-2 text-4xl font-bold text-blue-600 md:text-5xl">
                                {stats.total_components_generated.toLocaleString()}
                                +
                            </div>
                            <div className="text-gray-600">
                                🚀 Componentes Generados
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="mb-2 text-4xl font-bold text-blue-600 md:text-5xl">
                                {stats.satisfaction_rate}%
                            </div>
                            <div className="text-gray-600">⚡ Satisfacción</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
