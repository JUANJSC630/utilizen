import { Link } from '@inertiajs/react';

export default function UtilizenLogo() {
    return (
        <Link href="/" className="flex items-center gap-3">
            <img
                src="/utilizen-icon.png"
                alt="UtiliZen"
                className="h-10 w-10"
            />
            <span className="text-xl font-bold text-[var(--text-primary)]">
                UtiliZen
            </span>
        </Link>
    );
}
