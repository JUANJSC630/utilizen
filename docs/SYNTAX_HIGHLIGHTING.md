# Syntax Highlighting Documentation

## Overview

UtiliZen uses **Prism.js** for syntax highlighting in code outputs across all tools. This provides professional, readable code display with support for multiple programming languages.

## Implementation

### Components

#### `SyntaxHighlighter.tsx`
Main component for highlighting code blocks. Automatically applies syntax highlighting using Prism.js.

**Location**: `resources/js/components/tools/syntax-highlighter.tsx`

**Usage**:
```tsx
import SyntaxHighlighter from '@/components/tools/syntax-highlighter';

<SyntaxHighlighter
    code={generatedCode}
    language="jsx"
    className="custom-class"
/>
```

**Props**:
- `code: string` - The code to highlight
- `language: string` - Programming language (jsx, tsx, css, typescript, javascript, json, bash)
- `className?: string` - Additional CSS classes

#### `CodeOutput.tsx`
Complete code output component with copy, download, and syntax highlighting.

**Location**: `resources/js/components/tools/code-output.tsx`

**Features**:
- ✅ Syntax highlighting via Prism.js
- ✅ Copy to clipboard
- ✅ Download as file
- ✅ Custom filename display
- ✅ Mac-style window chrome

### Supported Languages

The following languages are pre-configured and available:

- JavaScript (`.js`)
- TypeScript (`.ts`)
- JSX (`.jsx`)
- TSX (`.tsx`)
- CSS (`.css`)
- JSON (`.json`)
- Bash (`.sh`)

### Theme

**Base Theme**: Prism Tomorrow (dark theme)

**Custom Overrides**: `resources/css/prism-custom.css`

The custom theme extends Prism Tomorrow with colors matched to UtiliZen's design system:

- Background: Transparent (inherits from parent)
- Font: Fira Code, Cascadia Code, JetBrains Mono
- Comments: `#7c8a99` (muted gray)
- Keywords: `#ffa657` (orange)
- Strings: `#a5d6ff` (light blue)
- Functions: `#d2a8ff` (purple)
- Numbers: `#79c0ff` (blue)

## Adding New Languages

To add support for a new language:

1. Import the language component in `syntax-highlighter.tsx`:
```tsx
import 'prismjs/components/prism-python';
```

2. Add the language to the `SyntaxHighlighter` props type (if needed)

3. Use it in your code:
```tsx
<SyntaxHighlighter code={pythonCode} language="python" />
```

## Performance

- **Lazy Loading**: Languages are only loaded when imported
- **Client-Side Only**: Highlighting runs in browser (not during SSR)
- **Memoization**: useEffect ensures highlighting only runs when code/language changes
- **Bundle Size**: ~36 kB added to React Component Generator bundle (gzipped: ~11 kB)

## Customization

### Changing Colors

Edit `resources/css/prism-custom.css` and modify token colors:

```css
.token.keyword {
    color: #your-color;
}
```

### Using a Different Theme

Replace the import in `syntax-highlighter.tsx`:

```tsx
// Replace this:
import 'prismjs/themes/prism-tomorrow.css';

// With:
import 'prismjs/themes/prism-okaidia.css';
```

Available themes:
- `prism.css` (default)
- `prism-dark.css`
- `prism-funky.css`
- `prism-okaidia.css`
- `prism-twilight.css`
- `prism-coy.css`
- `prism-solarizedlight.css`
- `prism-tomorrow.css` ✅ (current)

## Testing

The syntax highlighter is integrated with the React Component Generator. To test:

1. Visit `/tools/react-component-generator`
2. Configure a component with TypeScript enabled
3. Click "Generate Component"
4. Verify syntax highlighting appears correctly
5. Test copy and download functionality

## Troubleshooting

### Highlighting Not Working

**Issue**: Code appears without colors

**Solutions**:
1. Check browser console for errors
2. Verify language is imported in `syntax-highlighter.tsx`
3. Ensure `language` prop matches imported language name
4. Run `yarn build` to recompile

### Styles Not Applying

**Issue**: Colors don't match design

**Solutions**:
1. Check that `prism-custom.css` is imported in `app.css`
2. Clear browser cache
3. Verify CSS specificity (Prism styles may be overridden)

## Browser Support

Prism.js works in all modern browsers:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Dependencies

```json
{
  "prismjs": "^1.30.0",
  "@types/prismjs": "^1.26.5"
}
```

## References

- [Prism.js Official Site](https://prismjs.com/)
- [Prism.js GitHub](https://github.com/PrismJS/prism)
- [Available Languages](https://prismjs.com/#supported-languages)
- [Available Themes](https://github.com/PrismJS/prism-themes)
