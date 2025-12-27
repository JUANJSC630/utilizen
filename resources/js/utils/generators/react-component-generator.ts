export interface PropType {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function';
    required: boolean;
    arrayType?: 'string' | 'number' | 'object' | 'any';
    functionSignature?: string;
}

export interface HookConfig {
    type: string;
    stateName?: string;
    stateType?: string;
    dependencies?: string[];
    contextName?: string;
}

export interface ComponentConfig {
    componentName: string;
    componentType: 'functional' | 'class';
    hooks: string[];
    hookConfigs?: HookConfig[];
    includeProps: boolean;
    propTypes: PropType[];
    includeTypeScript: boolean;
    includeTests: boolean;
    testingLibrary?: 'jest' | 'vitest';
    includeSnapshotTests?: boolean;
    stylingMethod: 'css' | 'styled-components' | 'tailwind';
    includeComments: boolean;
    reactVersion: '17' | '18';
    useNamedExport?: boolean;
    exportTypes?: boolean;
    useMemo?: boolean;
    useForwardRef?: boolean;
    includeStorybook?: boolean;
    includeJSDoc?: boolean;
}

export class ReactComponentGenerator {
    private config: ComponentConfig;

    constructor(config: ComponentConfig) {
        this.config = config;
    }

    generate(): string {
        if (this.config.componentType === 'functional') {
            return this.generateFunctional();
        }
        return this.generateClass();
    }

    private generateFunctional(): string {
        const imports = this.buildImports();
        const propsInterface = this.buildPropsInterface();
        const hooks = this.buildHooks();
        const jsx = this.buildJSX();
        const propTypesExport = this.buildPropTypes();

        let code = '';

        // JSDoc Comment
        if (this.config.includeJSDoc) {
            code += `/**\n`;
            code += ` * ${this.config.componentName} Component\n`;
            code += ` * \n`;
            code += ` * @component\n`;
            if (this.config.includeProps && this.config.propTypes.length > 0) {
                code += ` * @param {Object} props - Component props\n`;
                this.config.propTypes.forEach((prop) => {
                    const jsType = this.mapTypeToJSDoc(prop);
                    code += ` * @param {${jsType}} props.${prop.name}${prop.required ? '' : '?'} - ${prop.name} prop\n`;
                });
            }
            code += ` * @returns {JSX.Element} Rendered component\n`;
            code += ` * \n`;
            code += ` * @example\n`;
            code += ` * <${this.config.componentName}`;
            if (this.config.includeProps && this.config.propTypes.length > 0) {
                const firstProp = this.config.propTypes[0];
                if (firstProp.type === 'string') {
                    code += ` ${firstProp.name}="example"`;
                }
            }
            code += ` />\n`;
            code += ` * \n`;
            code += ` * Generated with UtiliZen - https://utilizen.com\n`;
            code += ` */\n\n`;
        } else if (this.config.includeComments) {
            code += `/**\n * ${this.config.componentName} Component\n * Generated with UtiliZen - https://utilizen.com\n */\n\n`;
        }

        code += `${imports}\n\n`;

        if (propsInterface) {
            code += `${propsInterface}\n\n`;
            // Export type separately if requested
            if (this.config.exportTypes && this.config.includeTypeScript) {
                code += `export type { ${this.config.componentName}Props };\n\n`;
            }
        }

        const exportKeyword = this.config.useNamedExport
            ? 'export'
            : 'export default';

        // Component function signature
        let componentCode = `${exportKeyword} `;

        // Add React.memo if requested
        if (this.config.useMemo) {
            componentCode += `const ${this.config.componentName} = React.memo(`;
        }

        // Add forwardRef if requested
        if (this.config.useForwardRef) {
            if (this.config.includeTypeScript) {
                const elementType = this.getForwardRefElementType();
                componentCode += `React.forwardRef<${elementType}, ${this.config.includeProps && this.config.propTypes.length > 0 ? `${this.config.componentName}Props` : '{}'}>(`;
            } else {
                componentCode += `React.forwardRef(`;
            }
        }

        componentCode += `function ${this.config.componentName}(`;

        if (this.config.includeProps && this.config.propTypes.length > 0) {
            if (this.config.includeTypeScript) {
                componentCode += `{\n`;
                componentCode += this.config.propTypes
                    .map((prop) => `  ${prop.name}`)
                    .join(',\n');
                componentCode += `,\n}: ${this.config.componentName}Props`;
            } else {
                componentCode += `{\n`;
                componentCode += this.config.propTypes
                    .map((prop) => `  ${prop.name}`)
                    .join(',\n');
                componentCode += `,\n}`;
            }

            // Add ref parameter if forwardRef (with props)
            if (this.config.useForwardRef) {
                componentCode += ', ref';
            }
        } else if (this.config.useForwardRef) {
            // Only ref parameter when using forwardRef without props
            componentCode += 'ref';
        }

        componentCode += `) {\n`;

        code += componentCode;

        if (hooks) {
            code += `${hooks}\n\n`;
        }

        if (this.config.includeComments) {
            code += `  // Component logic here\n\n`;
        }

        code += `  return (\n${jsx}\n  );\n}`;

        // Close forwardRef if used
        if (this.config.useForwardRef) {
            code += `)`;
        }

        // Close React.memo if used
        if (this.config.useMemo) {
            code += `)`;
        }

        code += `;\n`;

        // Display name for debugging
        if (this.config.useMemo || this.config.useForwardRef) {
            code += `\n${this.config.componentName}.displayName = '${this.config.componentName}';\n`;
        }

        if (propTypesExport && !this.config.includeTypeScript) {
            code += `\n${propTypesExport}`;
        }

        return code;
    }

    private mapTypeToJSDoc(prop: PropType): string {
        switch (prop.type) {
            case 'string':
                return 'string';
            case 'number':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'array':
                if (prop.arrayType) {
                    return `Array<${prop.arrayType}>`;
                }
                return 'Array<any>';
            case 'object':
                return 'Object';
            case 'function':
                return 'Function';
            default:
                return 'any';
        }
    }

    private getForwardRefElementType(): string {
        // Return appropriate element type based on styling method
        switch (this.config.stylingMethod) {
            case 'styled-components':
                // Styled components don't use standard HTML elements
                return 'HTMLElement';
            case 'tailwind':
            case 'css':
            default:
                // Both tailwind and CSS modules use div as root
                return 'HTMLDivElement';
        }
    }

    private generateClass(): string {
        const imports = this.buildImports();
        const propsInterface = this.buildPropsInterface();
        const jsx = this.buildJSX();
        const propTypesExport = this.buildPropTypes();

        let code = '';

        if (this.config.includeComments) {
            code += `/**\n * ${this.config.componentName} Component\n * Generated with UtiliZen DevTools\n */\n\n`;
        }

        code += `${imports}\n\n`;

        if (propsInterface) {
            code += `${propsInterface}\n\n`;
        }

        code += `export default class ${this.config.componentName} extends React.Component`;

        if (
            this.config.includeTypeScript &&
            this.config.includeProps &&
            this.config.propTypes.length > 0
        ) {
            code += `<${this.config.componentName}Props>`;
        }

        code += ` {\n`;

        if (this.config.includeComments) {
            code += `  // Component lifecycle methods\n\n`;
        }

        // Add constructor if there are props
        if (this.config.includeProps && this.config.propTypes.length > 0) {
            code += `  constructor(props`;
            if (this.config.includeTypeScript) {
                code += `: ${this.config.componentName}Props`;
            }
            code += `) {\n`;
            code += `    super(props);\n`;
            if (this.config.includeComments) {
                code += `    // Initialize state here if needed\n`;
            }
            code += `  }\n\n`;
        }

        // Add componentDidMount
        code += `  componentDidMount() {\n`;
        if (this.config.includeComments) {
            code += `    // Fetch data, set up subscriptions, etc.\n`;
        }
        code += `  }\n\n`;

        // Add componentDidUpdate
        code += `  componentDidUpdate(prevProps`;
        if (
            this.config.includeTypeScript &&
            this.config.includeProps &&
            this.config.propTypes.length > 0
        ) {
            code += `: ${this.config.componentName}Props`;
        }
        code += `) {\n`;
        if (this.config.includeComments) {
            code += `    // Respond to prop or state changes\n`;
        }
        code += `  }\n\n`;

        // Add componentWillUnmount
        code += `  componentWillUnmount() {\n`;
        if (this.config.includeComments) {
            code += `    // Cleanup: unsubscribe, cancel requests, etc.\n`;
        }
        code += `  }\n\n`;

        code += `  render() {\n`;
        code += `    return (\n${jsx}\n    );\n`;
        code += `  }\n}\n`;

        if (propTypesExport && !this.config.includeTypeScript) {
            code += `\n${propTypesExport}`;
        }

        return code;
    }

    private buildImports(): string {
        const imports: string[] = [];
        const needsReact = this.config.useMemo || this.config.useForwardRef;

        if (this.config.componentType === 'functional') {
            const reactImports: string[] = [];

            if (this.config.hooks.length > 0) {
                reactImports.push(...this.config.hooks);
            }

            // Import React if using memo or forwardRef
            if (needsReact) {
                if (reactImports.length > 0) {
                    imports.push(
                        `import React, { ${reactImports.join(', ')} } from 'react';`,
                    );
                } else {
                    imports.push(`import React from 'react';`);
                }
            } else if (reactImports.length > 0) {
                imports.push(
                    `import { ${reactImports.join(', ')} } from 'react';`,
                );
            }
        } else {
            imports.push(`import React from 'react';`);
        }

        if (
            !this.config.includeTypeScript &&
            this.config.includeProps &&
            this.config.propTypes.length > 0
        ) {
            imports.push(`import PropTypes from 'prop-types';`);
        }

        if (this.config.stylingMethod === 'styled-components') {
            imports.push(
                `import { Container, Title, Text, Button, List, ListItem, Pre } from './${this.config.componentName}.styles';`,
            );
        } else if (this.config.stylingMethod === 'css') {
            imports.push(
                `import styles from './${this.config.componentName}.module.css';`,
            );
        }

        return imports.join('\n');
    }

    private buildPropsInterface(): string {
        if (
            !this.config.includeTypeScript ||
            !this.config.includeProps ||
            this.config.propTypes.length === 0
        ) {
            return '';
        }

        let code = `interface ${this.config.componentName}Props {\n`;

        this.config.propTypes.forEach((prop) => {
            code += `  ${prop.name}${prop.required ? '' : '?'}: ${this.mapTypeToTypeScript(prop)};\n`;
        });

        code += `}`;

        return code;
    }

    private buildHooks(): string {
        if (
            this.config.componentType !== 'functional' ||
            this.config.hooks.length === 0
        ) {
            return '';
        }

        const hookCode: string[] = [];

        this.config.hooks.forEach((hook) => {
            if (hook === 'useState') {
                if (this.config.includeTypeScript) {
                    hookCode.push(
                        `  const [isLoading, setIsLoading] = useState<boolean>(false);`,
                    );
                } else {
                    hookCode.push(
                        `  const [isLoading, setIsLoading] = useState(false);`,
                    );
                }
            } else if (hook === 'useEffect') {
                if (this.config.includeComments) {
                    hookCode.push(
                        `  // Run on component mount\n  useEffect(() => {\n    // Fetch data, set up subscriptions, etc.\n    return () => {\n      // Cleanup: unsubscribe, cancel requests, etc.\n    };\n  }, []);`,
                    );
                } else {
                    hookCode.push(
                        `  useEffect(() => {\n    // Component did mount logic\n    return () => {\n      // Cleanup logic\n    };\n  }, []);`,
                    );
                }
            } else if (hook === 'useContext') {
                if (this.config.includeComments) {
                    hookCode.push(
                        `  // Example context usage - replace ThemeContext with your context\n  // import { ThemeContext } from './ThemeContext';\n  // const theme = useContext(ThemeContext);`,
                    );
                } else {
                    hookCode.push(
                        `  // const theme = useContext(ThemeContext);`,
                    );
                }
            } else if (hook === 'useReducer') {
                if (this.config.includeTypeScript) {
                    hookCode.push(
                        `  const [state, dispatch] = useReducer(\n    (state: any, action: { type: string; payload?: any }) => {\n      switch (action.type) {\n        case 'UPDATE':\n          return { ...state, ...action.payload };\n        default:\n          return state;\n      }\n    },\n    { data: null }\n  );`,
                    );
                } else {
                    hookCode.push(
                        `  const [state, dispatch] = useReducer(\n    (state, action) => {\n      switch (action.type) {\n        case 'UPDATE':\n          return { ...state, ...action.payload };\n        default:\n          return state;\n      }\n    },\n    { data: null }\n  );`,
                    );
                }
            } else if (hook === 'useCallback') {
                hookCode.push(
                    `  const handleClick = useCallback(() => {\n    // Memoized callback function\n    console.log('Button clicked');\n  }, []);`,
                );
            } else if (hook === 'useMemo') {
                hookCode.push(
                    `  const computedValue = useMemo(() => {\n    // Example: expensive computation with data\n    // Replace with your actual computation\n    return Date.now();\n  }, []);`,
                );
            } else if (hook === 'useRef') {
                hookCode.push(
                    `  const inputRef = useRef${this.config.includeTypeScript ? '<HTMLInputElement>(null)' : '(null)'};`,
                );
            }
        });

        return hookCode.join('\n');
    }

    private buildJSX(): string {
        let jsx = '';
        const hasProps =
            this.config.includeProps && this.config.propTypes.length > 0;

        if (this.config.stylingMethod === 'tailwind') {
            // Add ref to root element if forwardRef is used
            const refAttr = this.config.useForwardRef ? ' ref={ref}' : '';
            jsx = `    <div${refAttr} className="flex flex-col gap-4 p-6">\n`;

            if (this.config.includeComments) {
                jsx += `      {/* ${this.config.componentName} Content */}\n`;
            }

            jsx += `      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">\n`;
            jsx += `        ${this.config.componentName}\n`;
            jsx += `      </h2>\n`;

            // Usar las props si existen
            if (hasProps) {
                jsx += `\n`;
                this.config.propTypes.forEach((prop) => {
                    if (prop.type === 'string') {
                        jsx += `      <p className="text-gray-700 dark:text-gray-300">{${prop.name}}</p>\n`;
                    } else if (prop.type === 'boolean') {
                        jsx += `      {${prop.name} && (\n`;
                        jsx += `        <div className="rounded-lg bg-blue-100 p-4 dark:bg-blue-900">\n`;
                        jsx += `          <p>Feature enabled</p>\n`;
                        jsx += `        </div>\n`;
                        jsx += `      )}\n`;
                    } else if (prop.type === 'number') {
                        jsx += `      <span className="text-sm font-medium">Count: {${prop.name}}</span>\n`;
                    } else if (prop.type === 'function') {
                        jsx += `      <button\n`;
                        jsx += `        onClick={${prop.name}}\n`;
                        jsx += `        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"\n`;
                        jsx += `      >\n`;
                        jsx += `        Click Me\n`;
                        jsx += `      </button>\n`;
                    } else if (prop.type === 'array') {
                        jsx += `      <ul className="space-y-2">\n`;
                        jsx += `        {${prop.name}${prop.required ? '' : '?'}.map((item, index) => (\n`;
                        jsx += `          <li key={index} className="rounded bg-gray-100 p-2 dark:bg-gray-800">\n`;
                        jsx += `            {${prop.arrayType === 'object' ? 'JSON.stringify(item)' : 'item'}}\n`;
                        jsx += `          </li>\n`;
                        jsx += `        ))}\n`;
                        jsx += `      </ul>\n`;
                    } else if (prop.type === 'object') {
                        jsx += `      <pre className="rounded bg-gray-100 p-4 text-xs dark:bg-gray-800">\n`;
                        jsx += `        {JSON.stringify(${prop.name}, null, 2)}\n`;
                        jsx += `      </pre>\n`;
                    }
                });
            }

            // Si usa useRef, incluir un input de ejemplo
            if (this.config.hooks.includes('useRef')) {
                jsx += `\n      <input\n`;
                jsx += `        ref={inputRef}\n`;
                jsx += `        type="text"\n`;
                jsx += `        placeholder="Enter text..."\n`;
                jsx += `        className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"\n`;
                jsx += `      />\n`;
            }

            jsx += `    </div>`;
        } else if (this.config.stylingMethod === 'styled-components') {
            // Add ref to root element if forwardRef is used
            const refAttr = this.config.useForwardRef ? ' ref={ref}' : '';
            jsx = `    <Container${refAttr}>\n`;
            jsx += `      <Title>${this.config.componentName}</Title>\n`;

            if (hasProps) {
                this.config.propTypes.forEach((prop) => {
                    if (prop.type === 'string') {
                        jsx += `      <Text>{${prop.name}}</Text>\n`;
                    } else if (prop.type === 'boolean') {
                        jsx += `      {${prop.name} && (\n`;
                        jsx += `        <Text>Feature enabled</Text>\n`;
                        jsx += `      )}\n`;
                    } else if (prop.type === 'number') {
                        jsx += `      <Text>Count: {${prop.name}}</Text>\n`;
                    } else if (prop.type === 'function') {
                        jsx += `      <Button onClick={${prop.name}}>Click Me</Button>\n`;
                    } else if (prop.type === 'array') {
                        jsx += `      <List>\n`;
                        jsx += `        {${prop.name}${prop.required ? '' : '?'}.map((item, index) => (\n`;
                        jsx += `          <ListItem key={index}>\n`;
                        jsx += `            {${prop.arrayType === 'object' ? 'JSON.stringify(item)' : 'item'}}\n`;
                        jsx += `          </ListItem>\n`;
                        jsx += `        ))}\n`;
                        jsx += `      </List>\n`;
                    } else if (prop.type === 'object') {
                        jsx += `      <Pre>{JSON.stringify(${prop.name}, null, 2)}</Pre>\n`;
                    }
                });
            }

            // Si usa useRef, incluir un input de ejemplo
            if (this.config.hooks.includes('useRef')) {
                jsx += `      <input\n`;
                jsx += `        ref={inputRef}\n`;
                jsx += `        type="text"\n`;
                jsx += `        placeholder="Enter text..."\n`;
                jsx += `        style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}\n`;
                jsx += `      />\n`;
            }

            jsx += `    </Container>`;
        } else {
            // CSS Modules - Add ref to root element if forwardRef is used
            const refAttr = this.config.useForwardRef ? ' ref={ref}' : '';
            jsx = `    <div${refAttr} className={styles.${this.config.componentName.toLowerCase()}}>\n`;
            jsx += `      <h1>${this.config.componentName}</h1>\n`;

            if (hasProps) {
                this.config.propTypes.forEach((prop) => {
                    if (prop.type === 'string') {
                        jsx += `      <p>{${prop.name}}</p>\n`;
                    } else if (prop.type === 'boolean') {
                        jsx += `      {${prop.name} && (\n`;
                        jsx += `        <div className={styles.feature}>\n`;
                        jsx += `          <p>Feature enabled</p>\n`;
                        jsx += `        </div>\n`;
                        jsx += `      )}\n`;
                    } else if (prop.type === 'number') {
                        jsx += `      <span>Count: {${prop.name}}</span>\n`;
                    } else if (prop.type === 'function') {
                        jsx += `      <button onClick={${prop.name}}>Click Me</button>\n`;
                    } else if (prop.type === 'array') {
                        jsx += `      <ul>\n`;
                        jsx += `        {${prop.name}${prop.required ? '' : '?'}.map((item, index) => (\n`;
                        jsx += `          <li key={index}>\n`;
                        jsx += `            {${prop.arrayType === 'object' ? 'JSON.stringify(item)' : 'item'}}\n`;
                        jsx += `          </li>\n`;
                        jsx += `        ))}\n`;
                        jsx += `      </ul>\n`;
                    } else if (prop.type === 'object') {
                        jsx += `      <pre>{JSON.stringify(${prop.name}, null, 2)}</pre>\n`;
                    }
                });
            }

            // Si usa useRef, incluir un input de ejemplo
            if (this.config.hooks.includes('useRef')) {
                jsx += `      <input\n`;
                jsx += `        ref={inputRef}\n`;
                jsx += `        type="text"\n`;
                jsx += `        placeholder="Enter text..."\n`;
                jsx += `        className={styles.input}\n`;
                jsx += `      />\n`;
            }

            jsx += `    </div>`;
        }

        return jsx;
    }

    private buildPropTypes(): string {
        if (
            this.config.includeTypeScript ||
            !this.config.includeProps ||
            this.config.propTypes.length === 0
        ) {
            return '';
        }

        let code = `\n${this.config.componentName}.propTypes = {\n`;

        this.config.propTypes.forEach((prop) => {
            const propType = this.mapTypeToPropType(prop.type);
            code += `  ${prop.name}: PropTypes.${propType}${prop.required ? '.isRequired' : ''},\n`;
        });

        code += `};`;

        return code;
    }

    private mapTypeToTypeScript(prop: PropType): string {
        switch (prop.type) {
            case 'string':
                return 'string';
            case 'number':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'array':
                if (prop.arrayType) {
                    return `${prop.arrayType}[]`;
                }
                return 'any[]';
            case 'object':
                return 'Record<string, any>';
            case 'function':
                return prop.functionSignature || '() => void';
            default:
                return 'any';
        }
    }

    private mapTypeToPropType(type: string): string {
        const typeMap: Record<string, string> = {
            string: 'string',
            number: 'number',
            boolean: 'bool',
            array: 'array',
            object: 'object',
            function: 'func',
        };

        return typeMap[type] || 'any';
    }

    generateTests(): string {
        if (!this.config.includeTests) {
            return '';
        }

        const testLib = this.config.testingLibrary || 'vitest';
        const mockFn = testLib === 'vitest' ? 'vi' : 'jest';
        let code = '';

        // Imports
        code += `import { render, screen, fireEvent } from '@testing-library/react';\n`;
        if (testLib === 'vitest') {
            code += `import { describe, it, expect, vi } from 'vitest';\n`;
        }

        // Use correct import based on export type
        if (this.config.useNamedExport) {
            code += `import { ${this.config.componentName} } from './${this.config.componentName}';\n\n`;
        } else {
            code += `import ${this.config.componentName} from './${this.config.componentName}';\n\n`;
        }

        // Test suite
        code += `describe('${this.config.componentName}', () => {\n`;

        // Test 1: Basic render
        code += `  it('renders without crashing', () => {\n`;
        code += `    ${this.renderComponentWithProps('    ')}\n`;
        code += `  });\n\n`;

        // Test 2: Props rendering (si hay props)
        if (this.config.includeProps && this.config.propTypes.length > 0) {
            this.config.propTypes.forEach((prop) => {
                if (prop.type === 'string') {
                    code += `  it('renders ${prop.name} prop correctly', () => {\n`;
                    code += `    const test${prop.name.charAt(0).toUpperCase() + prop.name.slice(1)} = 'Test ${prop.name}';\n`;
                    code += `    render(<${this.config.componentName} ${prop.name}={test${prop.name.charAt(0).toUpperCase() + prop.name.slice(1)}} />);\n`;
                    code += `    expect(screen.getByText(test${prop.name.charAt(0).toUpperCase() + prop.name.slice(1)})).toBeInTheDocument();\n`;
                    code += `  });\n\n`;
                } else if (prop.type === 'number') {
                    code += `  it('renders ${prop.name} number prop correctly', () => {\n`;
                    code += `    const { container } = render(<${this.config.componentName} ${prop.name}={42} />);\n`;
                    code += `    expect(container.textContent).toContain('42');\n`;
                    code += `  });\n\n`;
                } else if (prop.type === 'boolean') {
                    code += `  it('renders conditionally based on ${prop.name}', () => {\n`;
                    code += `    const { container: containerTrue } = render(<${this.config.componentName} ${prop.name}={true} />);\n`;
                    code += `    const { container: containerFalse } = render(<${this.config.componentName} ${prop.name}={false} />);\n`;
                    code += `    // Verify that the component renders differently based on the boolean prop\n`;
                    code += `    expect(containerTrue.innerHTML).not.toEqual(containerFalse.innerHTML);\n`;
                    code += `  });\n\n`;
                } else if (prop.type === 'array') {
                    code += `  it('renders ${prop.name} array prop correctly', () => {\n`;
                    code += `    const testItems = ['item1', 'item2', 'item3'];\n`;
                    code += `    const { container } = render(<${this.config.componentName} ${prop.name}={testItems} />);\n`;
                    code += `    testItems.forEach(item => {\n`;
                    code += `      expect(container.textContent).toContain(item);\n`;
                    code += `    });\n`;
                    code += `  });\n\n`;
                } else if (prop.type === 'object') {
                    code += `  it('renders ${prop.name} object prop correctly', () => {\n`;
                    code += `    const testObj = { key: 'value', count: 123 };\n`;
                    code += `    const { container } = render(<${this.config.componentName} ${prop.name}={testObj} />);\n`;
                    code += `    expect(container.textContent).toContain('key');\n`;
                    code += `    expect(container.textContent).toContain('value');\n`;
                    code += `  });\n\n`;
                } else if (prop.type === 'function') {
                    code += `  it('calls ${prop.name} when triggered', () => {\n`;
                    code += `    const mock${prop.name.charAt(0).toUpperCase() + prop.name.slice(1)} = ${mockFn}.fn();\n`;
                    code += `    render(<${this.config.componentName} ${prop.name}={mock${prop.name.charAt(0).toUpperCase() + prop.name.slice(1)}} />);\n`;
                    code += `    const button = screen.queryByRole('button');\n`;
                    code += `    if (button) {\n`;
                    code += `      fireEvent.click(button);\n`;
                    code += `      expect(mock${prop.name.charAt(0).toUpperCase() + prop.name.slice(1)}).toHaveBeenCalled();\n`;
                    code += `    }\n`;
                    code += `  });\n\n`;
                }
            });

            // Test 3: Required props validation (only for JavaScript with PropTypes)
            const requiredProps = this.config.propTypes.filter(
                (p) => p.required,
            );
            if (requiredProps.length > 0 && !this.config.includeTypeScript) {
                code += `  it('warns when required props are missing', () => {\n`;
                code += `    const consoleSpy = ${mockFn}.spyOn(console, 'error');\n`;
                code += `    render(<${this.config.componentName} />);\n`;
                code += `    expect(consoleSpy).toHaveBeenCalled();\n`;
                code += `    expect(consoleSpy.mock.calls[0][0]).toContain('Failed prop type');\n`;
                code += `    consoleSpy.mockRestore();\n`;
                code += `  });\n\n`;
            }
        }

        // Test 4: Snapshot test (si está habilitado)
        if (this.config.includeSnapshotTests) {
            code += `  it('matches snapshot', () => {\n`;
            code += `    const { container } = ${this.renderComponentWithProps('    ')};\n`;
            code += `    expect(container).toMatchSnapshot();\n`;
            code += `  });\n`;
        }

        code += `});\n`;

        return code;
    }

    private renderComponentWithProps(indent: string): string {
        let code = `render(<${this.config.componentName}`;

        if (this.config.includeProps && this.config.propTypes.length > 0) {
            code += `\n`;
            this.config.propTypes.forEach((prop) => {
                code += `${indent}  ${prop.name}={`;
                if (prop.type === 'string') {
                    code += `"test ${prop.name}"`;
                } else if (prop.type === 'number') {
                    code += `123`;
                } else if (prop.type === 'boolean') {
                    code += `true`;
                } else if (prop.type === 'function') {
                    code += `() => {}`;
                } else if (prop.type === 'array') {
                    if (prop.arrayType === 'string') {
                        code += `['item1', 'item2']`;
                    } else if (prop.arrayType === 'number') {
                        code += `[1, 2, 3]`;
                    } else if (prop.arrayType === 'object') {
                        code += `[{ id: 1 }, { id: 2 }]`;
                    } else {
                        code += `[]`;
                    }
                } else if (prop.type === 'object') {
                    code += `{ key: 'value' }`;
                }
                code += `}\n`;
            });
            code += `${indent}/>`;
        } else {
            code += ` />`;
        }

        code += `)`;
        return code;
    }

    getFilename(): string {
        const ext = this.config.includeTypeScript ? 'tsx' : 'jsx';
        return `${this.config.componentName}.${ext}`;
    }

    getTestFilename(): string {
        const ext = this.config.includeTypeScript ? 'tsx' : 'jsx';
        return `${this.config.componentName}.test.${ext}`;
    }

    generateCSSModule(): string {
        if (this.config.stylingMethod !== 'css') {
            return '';
        }

        let css = `/* ${this.config.componentName} Styles */\n\n`;
        css += `.${this.config.componentName.toLowerCase()} {\n`;
        css += `  display: flex;\n`;
        css += `  flex-direction: column;\n`;
        css += `  gap: 1rem;\n`;
        css += `  padding: 1.5rem;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} h1 {\n`;
        css += `  font-size: 1.5rem;\n`;
        css += `  font-weight: bold;\n`;
        css += `  color: #1f2937;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} p {\n`;
        css += `  color: #4b5563;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} span {\n`;
        css += `  color: #374151;\n`;
        css += `  font-weight: 500;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} button {\n`;
        css += `  padding: 0.5rem 1rem;\n`;
        css += `  background-color: #3b82f6;\n`;
        css += `  color: white;\n`;
        css += `  border: none;\n`;
        css += `  border-radius: 0.375rem;\n`;
        css += `  cursor: pointer;\n`;
        css += `  transition: background-color 0.2s;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} button:hover {\n`;
        css += `  background-color: #2563eb;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} .feature {\n`;
        css += `  padding: 1rem;\n`;
        css += `  background-color: #dbeafe;\n`;
        css += `  border-radius: 0.5rem;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} ul {\n`;
        css += `  list-style: none;\n`;
        css += `  padding: 0;\n`;
        css += `  margin: 0;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} li {\n`;
        css += `  padding: 0.5rem;\n`;
        css += `  background-color: #f3f4f6;\n`;
        css += `  margin-bottom: 0.5rem;\n`;
        css += `  border-radius: 0.25rem;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} pre {\n`;
        css += `  background-color: #f3f4f6;\n`;
        css += `  padding: 1rem;\n`;
        css += `  border-radius: 0.375rem;\n`;
        css += `  overflow-x: auto;\n`;
        css += `  font-size: 0.875rem;\n`;
        css += `  font-family: monospace;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} .input {\n`;
        css += `  padding: 0.5rem;\n`;
        css += `  border: 1px solid #d1d5db;\n`;
        css += `  border-radius: 0.375rem;\n`;
        css += `  font-size: 1rem;\n`;
        css += `}\n\n`;

        css += `.${this.config.componentName.toLowerCase()} .input:focus {\n`;
        css += `  outline: none;\n`;
        css += `  border-color: #3b82f6;\n`;
        css += `}\n`;

        return css;
    }

    generateStyledComponents(): string {
        if (this.config.stylingMethod !== 'styled-components') {
            return '';
        }

        let code = `import styled from 'styled-components';\n\n`;

        code += `export const Container = styled.div\`\n`;
        code += `  display: flex;\n`;
        code += `  flex-direction: column;\n`;
        code += `  gap: 1rem;\n`;
        code += `  padding: 1.5rem;\n`;
        code += `\`;\n\n`;

        code += `export const Title = styled.h1\`\n`;
        code += `  font-size: 1.5rem;\n`;
        code += `  font-weight: bold;\n`;
        code += `  color: #1f2937;\n`;
        code += `\`;\n\n`;

        code += `export const Text = styled.p\`\n`;
        code += `  color: #4b5563;\n`;
        code += `\`;\n\n`;

        code += `export const Button = styled.button\`\n`;
        code += `  padding: 0.5rem 1rem;\n`;
        code += `  background-color: #3b82f6;\n`;
        code += `  color: white;\n`;
        code += `  border: none;\n`;
        code += `  border-radius: 0.375rem;\n`;
        code += `  cursor: pointer;\n`;
        code += `  transition: background-color 0.2s;\n\n`;
        code += `  &:hover {\n`;
        code += `    background-color: #2563eb;\n`;
        code += `  }\n`;
        code += `\`;\n\n`;

        code += `export const List = styled.ul\`\n`;
        code += `  list-style: none;\n`;
        code += `  padding: 0;\n`;
        code += `  margin: 0;\n`;
        code += `  display: flex;\n`;
        code += `  flex-direction: column;\n`;
        code += `  gap: 0.5rem;\n`;
        code += `\`;\n\n`;

        code += `export const ListItem = styled.li\`\n`;
        code += `  padding: 0.5rem;\n`;
        code += `  background-color: #f3f4f6;\n`;
        code += `  border-radius: 0.25rem;\n`;
        code += `  color: #4b5563;\n`;
        code += `\`;\n\n`;

        code += `export const Pre = styled.pre\`\n`;
        code += `  background-color: #f3f4f6;\n`;
        code += `  padding: 1rem;\n`;
        code += `  border-radius: 0.375rem;\n`;
        code += `  overflow-x: auto;\n`;
        code += `  font-size: 0.875rem;\n`;
        code += `  font-family: monospace;\n`;
        code += `  color: #1f2937;\n`;
        code += `\`;\n`;

        return code;
    }

    generateStorybook(): string {
        if (!this.config.includeStorybook) {
            return '';
        }

        let code = `import type { Meta, StoryObj } from '@storybook/react';\n`;

        // Use correct import based on export type
        if (this.config.useNamedExport) {
            code += `import { ${this.config.componentName} } from './${this.config.componentName}';\n\n`;
        } else {
            code += `import ${this.config.componentName} from './${this.config.componentName}';\n\n`;
        }

        code += `const meta: Meta<typeof ${this.config.componentName}> = {\n`;
        code += `  title: 'Components/${this.config.componentName}',\n`;
        code += `  component: ${this.config.componentName},\n`;
        code += `  tags: ['autodocs'],\n`;

        if (this.config.includeProps && this.config.propTypes.length > 0) {
            code += `  argTypes: {\n`;
            this.config.propTypes.forEach((prop) => {
                code += `    ${prop.name}: {\n`;
                code += `      control: '${this.mapTypeToStorybookControl(prop.type)}',\n`;
                code += `      description: '${prop.name} prop',\n`;
                if (!prop.required) {
                    code += `      table: { defaultValue: { summary: 'undefined' } },\n`;
                }
                code += `    },\n`;
            });
            code += `  },\n`;
        }

        code += `};\n\n`;
        code += `export default meta;\n`;
        code += `type Story = StoryObj<typeof ${this.config.componentName}>;\n\n`;

        code += `export const Default: Story = {\n`;
        if (this.config.includeProps && this.config.propTypes.length > 0) {
            code += `  args: {\n`;
            this.config.propTypes.forEach((prop) => {
                if (prop.type === 'string') {
                    code += `    ${prop.name}: 'Example ${prop.name}',\n`;
                } else if (prop.type === 'number') {
                    code += `    ${prop.name}: 42,\n`;
                } else if (prop.type === 'boolean') {
                    code += `    ${prop.name}: true,\n`;
                } else if (prop.type === 'function') {
                    code += `    ${prop.name}: () => console.log('${prop.name} called'),\n`;
                } else if (prop.type === 'array') {
                    code += `    ${prop.name}: ['Item 1', 'Item 2', 'Item 3'],\n`;
                } else if (prop.type === 'object') {
                    code += `    ${prop.name}: { key: 'value' },\n`;
                }
            });
            code += `  },\n`;
        }
        code += `};\n`;

        return code;
    }

    private mapTypeToStorybookControl(type: string): string {
        const controlMap: Record<string, string> = {
            string: 'text',
            number: 'number',
            boolean: 'boolean',
            array: 'object',
            object: 'object',
            function: 'function',
        };
        return controlMap[type] || 'text';
    }

    getCSSModuleFilename(): string {
        return `${this.config.componentName}.module.css`;
    }

    getStyledComponentsFilename(): string {
        const ext = this.config.includeTypeScript ? 'ts' : 'js';
        return `${this.config.componentName}.styles.${ext}`;
    }

    getStorybookFilename(): string {
        const ext = this.config.includeTypeScript ? 'tsx' : 'jsx';
        return `${this.config.componentName}.stories.${ext}`;
    }
}
