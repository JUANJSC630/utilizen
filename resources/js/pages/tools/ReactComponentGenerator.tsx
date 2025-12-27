import CodeOutput from '@/components/tools/code-output';
import PremiumBadge from '@/components/tools/premium-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToolTracking } from '@/hooks/use-tool-tracking';
import PublicLayout from '@/layouts/public-layout';
import {
    ComponentConfig,
    PropType,
    ReactComponentGenerator,
} from '@/utils/generators/react-component-generator';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Tool {
    id: number;
    name: string;
    slug: string;
    description: string;
    meta_title: string;
    meta_description: string;
}

interface ReactComponentGeneratorProps {
    tool: Tool;
}

const AVAILABLE_HOOKS = [
    { value: 'useState', label: 'useState' },
    { value: 'useEffect', label: 'useEffect' },
    { value: 'useContext', label: 'useContext' },
    { value: 'useReducer', label: 'useReducer' },
    { value: 'useCallback', label: 'useCallback' },
    { value: 'useMemo', label: 'useMemo' },
    { value: 'useRef', label: 'useRef' },
];

const PROP_TYPES = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'array', label: 'Array' },
    { value: 'object', label: 'Object' },
    { value: 'function', label: 'Function' },
];

export default function ReactComponentGeneratorPage({
    tool,
}: ReactComponentGeneratorProps) {
    const { track } = useToolTracking();
    const [generatedCode, setGeneratedCode] = useState<string>('');
    const [generatedTests, setGeneratedTests] = useState<string>('');
    const [generatedStyles, setGeneratedStyles] = useState<string>('');
    const [generatedStorybook, setGeneratedStorybook] = useState<string>('');

    const [config, setConfig] = useState<ComponentConfig>({
        componentName: 'MyComponent',
        componentType: 'functional',
        hooks: [],
        includeProps: false,
        propTypes: [],
        includeTypeScript: false,
        includeTests: false,
        testingLibrary: 'vitest',
        includeSnapshotTests: false,
        stylingMethod: 'tailwind',
        includeComments: true,
        reactVersion: '18',
        useNamedExport: false,
        exportTypes: false,
        useMemo: false,
        useForwardRef: false,
        includeStorybook: false,
        includeJSDoc: false,
    });

    const [currentProp, setCurrentProp] = useState<PropType>({
        name: '',
        type: 'string',
        required: true,
    });

    useEffect(() => {
        track({ toolId: tool.id, action: 'view' });
    }, []);

    const validateComponentName = (name: string): string | null => {
        if (!name || name.trim() === '') {
            return 'Component name is required';
        }

        if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
            return 'Component name must be PascalCase (e.g., MyComponent)';
        }

        if (name.length > 50) {
            return 'Component name is too long (max 50 characters)';
        }

        return null;
    };

    const validatePropName = (
        name: string,
        checkDuplicate: boolean = true,
    ): string | null => {
        if (!name || name.trim() === '') {
            return 'Prop name is required';
        }

        if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) {
            return 'Prop name must be camelCase (e.g., userName)';
        }

        if (name.length > 30) {
            return 'Prop name is too long (max 30 characters)';
        }

        // Check if prop name already exists (only when adding new props)
        if (checkDuplicate && config.propTypes.some((p) => p.name === name)) {
            return 'Prop name already exists';
        }

        return null;
    };

    const handleGenerate = () => {
        try {
            // Validate component name
            const nameError = validateComponentName(config.componentName);
            if (nameError) {
                toast.error(nameError);
                return;
            }

            // Validate props
            if (config.includeProps) {
                for (const prop of config.propTypes) {
                    const propError = validatePropName(prop.name, false);
                    if (propError) {
                        toast.error(
                            `Invalid prop "${prop.name}": ${propError}`,
                        );
                        return;
                    }
                }
            }

            // Validate incompatible combinations
            if (config.componentType === 'class') {
                if (config.useForwardRef) {
                    toast.error(
                        'forwardRef is only compatible with functional components',
                    );
                    return;
                }
                if (config.useMemo) {
                    toast.error(
                        'React.memo is only compatible with functional components',
                    );
                    return;
                }
                if (config.hooks.length > 0) {
                    toast.error(
                        'React Hooks are only compatible with functional components',
                    );
                    return;
                }
            }

            const generator = new ReactComponentGenerator(config);

            // Generate main component
            const code = generator.generate();
            setGeneratedCode(code);

            // Generate tests
            if (config.includeTests) {
                const tests = generator.generateTests();
                setGeneratedTests(tests);
            } else {
                setGeneratedTests('');
            }

            // Generate styles
            if (config.stylingMethod === 'css') {
                const css = generator.generateCSSModule();
                setGeneratedStyles(css);
            } else if (config.stylingMethod === 'styled-components') {
                const styled = generator.generateStyledComponents();
                setGeneratedStyles(styled);
            } else {
                setGeneratedStyles('');
            }

            // Generate Storybook
            if (config.includeStorybook) {
                const storybook = generator.generateStorybook();
                setGeneratedStorybook(storybook);
            } else {
                setGeneratedStorybook('');
            }

            track({
                toolId: tool.id,
                action: 'generate',
                metadata: {
                    componentType: config.componentType,
                    hooksCount: config.hooks.length,
                    propsCount: config.propTypes.length,
                    includeTypeScript: config.includeTypeScript,
                    includeTests: config.includeTests,
                    includeStorybook: config.includeStorybook,
                    stylingMethod: config.stylingMethod,
                },
            });

            toast.success('Component generated successfully!');
        } catch (error) {
            toast.error('Failed to generate component');
            console.error(error);
        }
    };

    const addProp = () => {
        const error = validatePropName(currentProp.name);
        if (error) {
            toast.error(error);
            return;
        }

        setConfig({
            ...config,
            propTypes: [...config.propTypes, currentProp],
        });

        setCurrentProp({
            name: '',
            type: 'string',
            required: true,
        });

        toast.success(`Added prop: ${currentProp.name}`);
    };

    const removeProp = (index: number) => {
        setConfig({
            ...config,
            propTypes: config.propTypes.filter((_, i) => i !== index),
        });
    };

    const toggleHook = (hook: string) => {
        setConfig({
            ...config,
            hooks: config.hooks.includes(hook)
                ? config.hooks.filter((h) => h !== hook)
                : [...config.hooks, hook],
        });
    };

    return (
        <PublicLayout
            title={tool.meta_title}
            description={tool.meta_description}
        >
            <Head>
                <meta property="og:title" content={tool.meta_title} />
                <meta
                    property="og:description"
                    content={tool.meta_description}
                />
            </Head>

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)]">
                        {tool.name}
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)]">
                        {tool.description}
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Configuration Panel */}
                    <div className="space-y-6 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] p-6">
                        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                            Configuration
                        </h2>

                        {/* Component Name */}
                        <div className="space-y-2">
                            <Label htmlFor="componentName">
                                Component Name
                            </Label>
                            <Input
                                id="componentName"
                                value={config.componentName}
                                onChange={(e) =>
                                    setConfig({
                                        ...config,
                                        componentName: e.target.value,
                                    })
                                }
                                placeholder="MyComponent"
                            />
                        </div>

                        {/* Component Type */}
                        <div className="space-y-2">
                            <Label htmlFor="componentType">
                                Component Type
                            </Label>
                            <Select
                                value={config.componentType}
                                onValueChange={(
                                    value: 'functional' | 'class',
                                ) =>
                                    setConfig({
                                        ...config,
                                        componentType: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="functional">
                                        Functional Component
                                    </SelectItem>
                                    <SelectItem value="class">
                                        Class Component
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* React Hooks */}
                        {config.componentType === 'functional' && (
                            <div className="space-y-2">
                                <Label>React Hooks</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {AVAILABLE_HOOKS.map((hook) => (
                                        <div
                                            key={hook.value}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={hook.value}
                                                checked={config.hooks.includes(
                                                    hook.value,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleHook(hook.value)
                                                }
                                            />
                                            <label
                                                htmlFor={hook.value}
                                                className="text-sm leading-none font-medium text-[var(--text-primary)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {hook.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Props Configuration */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Props</Label>
                                <Checkbox
                                    checked={config.includeProps}
                                    onCheckedChange={(checked) =>
                                        setConfig({
                                            ...config,
                                            includeProps: Boolean(checked),
                                        })
                                    }
                                />
                            </div>

                            {config.includeProps && (
                                <div className="space-y-3 rounded-lg bg-[var(--bg-tertiary)] p-4">
                                    <div className="grid grid-cols-12 gap-2">
                                        <Input
                                            className="col-span-5"
                                            placeholder="Prop name"
                                            value={currentProp.name}
                                            onChange={(e) =>
                                                setCurrentProp({
                                                    ...currentProp,
                                                    name: e.target.value,
                                                })
                                            }
                                        />

                                        <Select
                                            value={currentProp.type}
                                            onValueChange={(value: any) =>
                                                setCurrentProp({
                                                    ...currentProp,
                                                    type: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="col-span-4">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PROP_TYPES.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="col-span-2 flex items-center">
                                            <Checkbox
                                                checked={currentProp.required}
                                                onCheckedChange={(checked) =>
                                                    setCurrentProp({
                                                        ...currentProp,
                                                        required:
                                                            Boolean(checked),
                                                    })
                                                }
                                            />
                                            <span className="ml-1 text-xs text-[var(--text-secondary)]">
                                                Req
                                            </span>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={addProp}
                                            className="col-span-1"
                                            size="sm"
                                        >
                                            +
                                        </Button>
                                    </div>

                                    {config.propTypes.length > 0 && (
                                        <div className="space-y-1">
                                            {config.propTypes.map(
                                                (prop, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm"
                                                    >
                                                        <span className="font-medium">
                                                            {prop.name}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-[var(--text-tertiary)]">
                                                                {prop.type}
                                                            </span>
                                                            {prop.required && (
                                                                <span className="text-xs text-red-500">
                                                                    *
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    removeProp(
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Styling Method */}
                        <div className="space-y-2">
                            <Label>Styling Method</Label>
                            <Select
                                value={config.stylingMethod}
                                onValueChange={(
                                    value:
                                        | 'css'
                                        | 'styled-components'
                                        | 'tailwind',
                                ) =>
                                    setConfig({
                                        ...config,
                                        stylingMethod: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="css">
                                        CSS Modules
                                    </SelectItem>
                                    <SelectItem value="styled-components">
                                        Styled Components
                                    </SelectItem>
                                    <SelectItem value="tailwind">
                                        Tailwind CSS
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                            <Label>Options</Label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeComments"
                                        checked={config.includeComments}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                includeComments:
                                                    Boolean(checked),
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="includeComments"
                                        className="text-sm text-[var(--text-primary)]"
                                    >
                                        Include Comments
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeTypeScript"
                                        checked={config.includeTypeScript}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                includeTypeScript:
                                                    Boolean(checked),
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="includeTypeScript"
                                        className="flex items-center gap-2 text-sm text-[var(--text-primary)]"
                                    >
                                        TypeScript
                                        <PremiumBadge size="sm" />
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeTests"
                                        checked={config.includeTests}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                includeTests: Boolean(checked),
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="includeTests"
                                        className="flex items-center gap-2 text-sm text-[var(--text-primary)]"
                                    >
                                        Generate Tests
                                        <PremiumBadge size="sm" />
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeJSDoc"
                                        checked={config.includeJSDoc}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                includeJSDoc: Boolean(checked),
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="includeJSDoc"
                                        className="text-sm text-[var(--text-primary)]"
                                    >
                                        JSDoc Comments
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="useMemo"
                                        checked={config.useMemo}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                useMemo: Boolean(checked),
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="useMemo"
                                        className="text-sm text-[var(--text-primary)]"
                                    >
                                        Wrap with React.memo
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="useForwardRef"
                                        checked={config.useForwardRef}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                useForwardRef: Boolean(checked),
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="useForwardRef"
                                        className="text-sm text-[var(--text-primary)]"
                                    >
                                        Use forwardRef
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="useNamedExport"
                                        checked={config.useNamedExport}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                useNamedExport:
                                                    Boolean(checked),
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="useNamedExport"
                                        className="text-sm text-[var(--text-primary)]"
                                    >
                                        Named Export
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeStorybook"
                                        checked={config.includeStorybook}
                                        onCheckedChange={(checked) =>
                                            setConfig({
                                                ...config,
                                                includeStorybook:
                                                    Boolean(checked),
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="includeStorybook"
                                        className="flex items-center gap-2 text-sm text-[var(--text-primary)]"
                                    >
                                        Storybook Stories
                                        <PremiumBadge size="sm" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <Button
                            onClick={handleGenerate}
                            className="w-full"
                            size="lg"
                        >
                            Generate Component
                        </Button>
                    </div>

                    {/* Output Panel */}
                    <div className="space-y-6">
                        {generatedCode ? (
                            <>
                                <CodeOutput
                                    code={generatedCode}
                                    language={
                                        config.includeTypeScript ? 'tsx' : 'jsx'
                                    }
                                    filename={`${config.componentName}.${config.includeTypeScript ? 'tsx' : 'jsx'}`}
                                    onCopy={() =>
                                        track({
                                            toolId: tool.id,
                                            action: 'copy',
                                        })
                                    }
                                    onDownload={() =>
                                        track({
                                            toolId: tool.id,
                                            action: 'download',
                                        })
                                    }
                                />

                                {generatedTests && (
                                    <CodeOutput
                                        code={generatedTests}
                                        language={
                                            config.includeTypeScript
                                                ? 'tsx'
                                                : 'jsx'
                                        }
                                        filename={`${config.componentName}.test.${config.includeTypeScript ? 'tsx' : 'jsx'}`}
                                        onCopy={() =>
                                            track({
                                                toolId: tool.id,
                                                action: 'copy',
                                            })
                                        }
                                        onDownload={() =>
                                            track({
                                                toolId: tool.id,
                                                action: 'download',
                                            })
                                        }
                                    />
                                )}

                                {generatedStyles && (
                                    <CodeOutput
                                        code={generatedStyles}
                                        language={
                                            config.stylingMethod === 'css'
                                                ? 'css'
                                                : config.includeTypeScript
                                                  ? 'typescript'
                                                  : 'javascript'
                                        }
                                        filename={
                                            config.stylingMethod === 'css'
                                                ? `${config.componentName}.module.css`
                                                : `${config.componentName}.styles.${config.includeTypeScript ? 'ts' : 'js'}`
                                        }
                                        onCopy={() =>
                                            track({
                                                toolId: tool.id,
                                                action: 'copy',
                                            })
                                        }
                                        onDownload={() =>
                                            track({
                                                toolId: tool.id,
                                                action: 'download',
                                            })
                                        }
                                    />
                                )}

                                {generatedStorybook && (
                                    <CodeOutput
                                        code={generatedStorybook}
                                        language={
                                            config.includeTypeScript
                                                ? 'tsx'
                                                : 'jsx'
                                        }
                                        filename={`${config.componentName}.stories.${config.includeTypeScript ? 'tsx' : 'jsx'}`}
                                        onCopy={() =>
                                            track({
                                                toolId: tool.id,
                                                action: 'copy',
                                            })
                                        }
                                        onDownload={() =>
                                            track({
                                                toolId: tool.id,
                                                action: 'download',
                                            })
                                        }
                                    />
                                )}
                            </>
                        ) : (
                            <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-[var(--border-default)] bg-[var(--bg-tertiary)]">
                                <div className="text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-[var(--text-tertiary)]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                        />
                                    </svg>
                                    <p className="mt-2 text-sm text-[var(--text-tertiary)]">
                                        Configure your component and click
                                        generate
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
