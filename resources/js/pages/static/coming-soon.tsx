import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Code2 } from 'lucide-react';

interface ComingSoonProps {
    title: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export default function ComingSoon({
    title,
    description,
    icon: Icon,
}: ComingSoonProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title={`${title} - UtiliZen`}>
                <meta name="description" content={description} />
            </Head>

            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Navigation */}
                <nav className="border-b border-gray-200 dark:border-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                                    <Code2 className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    UtiliZen
                                </span>
                            </Link>

                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-8">
                            {Icon ? (
                                <Icon className="mx-auto h-24 w-24 text-blue-600" />
                            ) : (
                                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                                    <Code2 className="h-12 w-12 text-white" />
                                </div>
                            )}
                        </div>

                        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h1>

                        <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
                            {description}
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-900"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                Back to Home
                            </Link>

                            <Link
                                href="/tools"
                                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700"
                            >
                                Browse Tools
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-200 px-4 py-12 dark:border-gray-800">
                    <div className="mx-auto max-w-7xl text-center text-gray-600 dark:text-gray-400">
                        <p>
                            &copy; {new Date().getFullYear()} UtiliZen. All
                            rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
