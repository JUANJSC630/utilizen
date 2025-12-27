import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => changeLanguage('en')}
                className={`group relative flex h-8 w-8 items-center justify-center rounded-md transition-all ${
                    i18n.language === 'en'
                        ? 'ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--bg-primary)]'
                        : 'opacity-60 hover:opacity-100'
                }`}
                title="English"
            >
                {/* USA Flag */}
                <svg
                    viewBox="0 0 512 512"
                    className="h-6 w-6 rounded-sm"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="512" height="512" fill="#B22234" />
                    <g fill="#fff">
                        <rect y="39.38" width="512" height="39.38" />
                        <rect y="118.14" width="512" height="39.38" />
                        <rect y="196.9" width="512" height="39.38" />
                        <rect y="275.66" width="512" height="39.38" />
                        <rect y="354.42" width="512" height="39.38" />
                        <rect y="433.18" width="512" height="39.38" />
                    </g>
                    <rect width="204.8" height="275.66" fill="#3C3B6E" />
                    <g fill="#fff">
                        {/* Simplified stars pattern */}
                        <circle cx="25" cy="25" r="8" />
                        <circle cx="75" cy="25" r="8" />
                        <circle cx="125" cy="25" r="8" />
                        <circle cx="175" cy="25" r="8" />
                        <circle cx="50" cy="55" r="8" />
                        <circle cx="100" cy="55" r="8" />
                        <circle cx="150" cy="55" r="8" />
                        <circle cx="25" cy="85" r="8" />
                        <circle cx="75" cy="85" r="8" />
                        <circle cx="125" cy="85" r="8" />
                        <circle cx="175" cy="85" r="8" />
                        <circle cx="50" cy="115" r="8" />
                        <circle cx="100" cy="115" r="8" />
                        <circle cx="150" cy="115" r="8" />
                        <circle cx="25" cy="145" r="8" />
                        <circle cx="75" cy="145" r="8" />
                        <circle cx="125" cy="145" r="8" />
                        <circle cx="175" cy="145" r="8" />
                        <circle cx="50" cy="175" r="8" />
                        <circle cx="100" cy="175" r="8" />
                        <circle cx="150" cy="175" r="8" />
                        <circle cx="25" cy="205" r="8" />
                        <circle cx="75" cy="205" r="8" />
                        <circle cx="125" cy="205" r="8" />
                        <circle cx="175" cy="205" r="8" />
                        <circle cx="50" cy="235" r="8" />
                        <circle cx="100" cy="235" r="8" />
                        <circle cx="150" cy="235" r="8" />
                    </g>
                </svg>
            </button>

            <button
                onClick={() => changeLanguage('es')}
                className={`group relative flex h-8 w-8 items-center justify-center rounded-md transition-all ${
                    i18n.language === 'es'
                        ? 'ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--bg-primary)]'
                        : 'opacity-60 hover:opacity-100'
                }`}
                title="Español"
            >
                {/* Spain Flag */}
                <svg
                    viewBox="0 0 512 512"
                    className="h-6 w-6 rounded-sm"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="512" height="512" fill="#C60B1E" />
                    <rect y="128" width="512" height="256" fill="#FFC400" />
                </svg>
            </button>
        </div>
    );
}
