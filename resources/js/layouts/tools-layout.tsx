import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface ToolsLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function ToolsLayout({
    children,
    title = 'UtiliZen - DevTools Suite',
    description = 'Professional online tools for web developers',
}: ToolsLayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>

            <div className="flex min-h-screen flex-col">
                {/* Header */}
                <header className="border-b bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-8">
                                <a
                                    href="/"
                                    className="text-xl font-bold text-gray-900"
                                >
                                    Utilizen
                                </a>

                                <nav className="hidden gap-6 md:flex">
                                    <a
                                        href="/tools"
                                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        Tools
                                    </a>
                                    <a
                                        href="/blog"
                                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        Blog
                                    </a>
                                    <a
                                        href="/pricing"
                                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        Pricing
                                    </a>
                                </nav>
                            </div>

                            <div className="flex items-center gap-4">
                                <a
                                    href="/dashboard"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Dashboard
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">{children}</main>

                {/* Footer */}
                <footer className="border-t bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                    Tools
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="/tools/react-component-generator"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Component Generator
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/tools/react-props-validator"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Props Validator
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/tools/react-performance-analyzer"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Performance Analyzer
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                    Resources
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="/blog"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/docs"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Documentation
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                    Company
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="/about"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/pricing"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Pricing
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                    Legal
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="/privacy"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Privacy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/terms"
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            Terms
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
                            © {new Date().getFullYear()} Utilizen. All rights
                            reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
