import Prism from 'prismjs';
import { useEffect, useRef } from 'react';

// Import Prism languages
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

// Import Prism theme
import 'prismjs/themes/prism-tomorrow.css';

interface SyntaxHighlighterProps {
    code: string;
    language: string;
    className?: string;
}

/**
 * SyntaxHighlighter Component
 *
 * Provides syntax highlighting for code blocks using Prism.js
 *
 * @param {string} code - The code to highlight
 * @param {string} language - The programming language (jsx, tsx, css, etc.)
 * @param {string} className - Additional CSS classes
 */
export default function SyntaxHighlighter({
    code,
    language,
    className = '',
}: SyntaxHighlighterProps) {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            // Highlight the code block
            Prism.highlightElement(codeRef.current);
        }
    }, [code, language]);

    return (
        <pre className={`language-${language} ${className}`}>
            <code ref={codeRef} className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
}
