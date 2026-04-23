import * as ts from 'typescript';

const isCamelCase = (name: string): boolean => /^[a-z][a-zA-Z0-9]*$/.test(name);

/**
 * Normalizes complex TypeScript and JavaScript types into 
 * the basic types supported by the runtime validator.
 */
function normalizeType(typeStr: string): string {
    const t = typeStr.trim();
    // Handle Array types: Array, Array<T>, T[]
    if (t === 'Array' || t.includes('[]') || t.startsWith('Array<') || t.startsWith('[') && t.endsWith(']')) {
        return 'Array';
    }
    // Handle Object types: Object, Record<K, V>, { [key: string]: any }
    if (t === 'Object' || t.startsWith('Record<') || (t.startsWith('{') && t.endsWith('}'))) {
        return 'Object';
    }
    // Capitalize first letter for primitives (string -> String)
    return t.charAt(0).toUpperCase() + t.slice(1);
}

export interface SFCDescriptor {
    filename: string;
    source: string;
    name?: string;
    imports?: string;
    template: {
        content: string;
    } | null;
    script: {
        content: string;
    } | null;
    styles: {
        content: string;
        scoped: boolean;
    }[];
    scopeId?: string;
    props: string[]; // List of attributes to observe
    defaultProps: Record<string, any>;
    propDefinitions: Record<string, any>; // Stores types/required metadata
    extends?: string; // Native element to extend (e.g., 'button')
    
}

/**
 * Parses a .can file source code into a descriptor.
 * Extracts the component name, script body, and template string.
 */
export function parse(source: string, filename: string): SFCDescriptor {
    const descriptor: SFCDescriptor = {
        filename,
        source,
        template: null,
        script: null,
        imports: '',
        styles: [],
        props: [],
        defaultProps: {},
        propDefinitions: {},
    };

    // 1. Extract Component Name
    const nameMatch = source.match(/component\s+(\w+)\s*\{/);
    if (nameMatch) {
        descriptor.name = nameMatch[1];
        if (nameMatch.index !== undefined) {
            descriptor.imports = source.substring(0, nameMatch.index).trim();
        }
    }

    // // 2. Extract Imports (content before component definition)
    // const importsMatch = source.match(/^([\s\S]*?)component/);
    // if (importsMatch) {
    //     descriptor.imports = importsMatch[1].trim();
    // }

    // 3. Extract Template (var template = `...`;)
   // const templateRegex = /var\s+template\s*=\s*`([\s\S]*?)`;/;
   const templateRegex = /var\s+template\s*=\s*(`[\s\S]*?`|[\s\S]*?);/;
    const templateMatch = source.match(templateRegex);

    if (templateMatch) {
        let content = templateMatch[1].trim();
        // Strip quotes if it's a string literal
        if ((content.startsWith('`') && content.endsWith('`')) ||
            (content.startsWith('"') && content.endsWith('"')) ||
            (content.startsWith("'") && content.endsWith("'"))) {
            content = content.slice(1, -1);
        }
        descriptor.template = {
            content
        };
    }

    // 4. Extract Script (body inside component { ... })
    const componentStartRegex = /component\s+\w+\s*\{/;
    const startMatch = source.match(componentStartRegex);

    if (startMatch && startMatch.index !== undefined) {
        const startIndex = startMatch.index + startMatch[0].length;
        let braceDepth = 1;
        let endIndex = -1;

        for (let i = startIndex; i < source.length; i++) {
            if (source[i] === '{') {
                braceDepth++;
            } else if (source[i] === '}') {
                braceDepth--;
            }
            if (braceDepth === 0) {
                endIndex = i;
                break;
            }
        }

        if (endIndex !== -1) {
            let scriptContent = source.substring(startIndex, endIndex);
            const cssRegex = /<style(\s+scoped)?>([\s\S]*?)<\/style>/g;

            // Remove the template definition from the script to keep it clean
            scriptContent = scriptContent.replace(templateRegex, '');
            scriptContent = scriptContent.replace(cssRegex, '');
           // scriptContent = scriptContent.replace(/(\s)(var|let|const)\s+(\w+)/g, '$1$3');

            // Extract props: supports (var|let|const) props = [...] or props: Record<string, any> = { ... }
            const propsMatch = scriptContent.match(/(?:var|let|const)\s+props(?:\s*:\s*[\s\S]+?)?\s*=\s*([\[{][\s\S]*?[\]}]);?/);
            if (propsMatch) {
                const rawValue = propsMatch[1].trim();
                if (rawValue.startsWith('[')) {
                    // Array literal: extract strings
                    descriptor.props = rawValue
                        .slice(1, -1)
                        .split(',')
                        .map(p => p.trim().replace(/['"`]/g, ''))
                        .filter(Boolean);
                    descriptor.props.forEach(key => {
                        if (!isCamelCase(key)) console.warn(`[SFC Parser] Prop "${key}" in component "${descriptor.name}" should be camelCase.`);
                    });
                } else {
                    // Object literal: extract keys (e.g. { name: String })
                    const sourceFile = ts.createSourceFile('props.ts', `const p = ${rawValue}`, ts.ScriptTarget.Latest, true);
                    const statement = sourceFile.statements[0] as ts.VariableStatement;
                    const initializer = statement.declarationList.declarations[0].initializer;

                    if (initializer && ts.isObjectLiteralExpression(initializer)) {
                        const printer = ts.createPrinter();
                        initializer.properties.forEach(prop => {
                            if (ts.isPropertyAssignment(prop)) {
                                const key = prop.name.getText(sourceFile).replace(/['"`]/g, '');
                                descriptor.props.push(key);

                                if (ts.isObjectLiteralExpression(prop.initializer)) {
                                    const meta: any = {};
                                    prop.initializer.properties.forEach(mProp => {
                                        if (ts.isPropertyAssignment(mProp)) {
                                            const mKey = mProp.name.getText(sourceFile);
                                            if (mKey === 'default') {
                                                const valNode = mProp.initializer;
                                                const valStr = valNode.getText(sourceFile);
                                                try {
                                                    // Use more reliable way to evaluate basic literals
                                                    if (ts.isStringLiteral(valNode)) descriptor.defaultProps[key] = valNode.text;
                                                    else if (ts.isNumericLiteral(valNode)) descriptor.defaultProps[key] = Number(valNode.text);
                                                    else if (valStr === 'true') descriptor.defaultProps[key] = true;
                                                    else if (valStr === 'false') descriptor.defaultProps[key] = false;
                                                    else descriptor.defaultProps[key] = new Function(`return ${valStr}`)();
                                                } catch {
                                                    descriptor.defaultProps[key] = valStr;
                                                }
                                            } else if (mKey === 'type') {
                                                meta.type = normalizeType(mProp.initializer.getText(sourceFile).replace(/['"`]/g, ''));
                                            } else if (mKey === 'required') {
                                                meta.required = mProp.initializer.getText(sourceFile) === 'true';
                                            } else if (mKey === 'validator') {
                                                meta.validator = mProp.initializer.getText(sourceFile);
                                            }
                                        }
                                    });
                                    descriptor.propDefinitions[key] = meta;
                                } else {
                                    descriptor.propDefinitions[key] = { type: normalizeType(prop.initializer.getText(sourceFile)) };
                                }
                                if (!isCamelCase(key)) {
                                    console.warn(`[SFC Parser] Prop "${key}" in component "${descriptor.name}" should be camelCase.`);
                                }
                            }
                        });
                    }
                }
                
                // Remove the props definition from the script to avoid conflict with runtime 'this.props'
                scriptContent = scriptContent.replace(propsMatch[0], '');
            }

            // New: Extract props from TS Interface or Type Alias (interface Props { ... })
            const tsSource = ts.createSourceFile('script.ts', scriptContent, ts.ScriptTarget.Latest, true);
            tsSource.statements.forEach(node => {
                if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text === 'Props') {
                    let members: ts.NodeArray<ts.TypeElement> | ts.NodeArray<ts.TypeElement> = [] as any;
                    
                    if (ts.isInterfaceDeclaration(node)) {
                        members = node.members;
                    } else if (ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type)) {
                        members = node.type.members;
                    }

                    members.forEach(member => {
                        if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
                            const key = member.name.text;
                            if (!isCamelCase(key)) console.warn(`[SFC Parser] Prop "${key}" in component "${descriptor.name}" should be camelCase.`);
                            if (!descriptor.props.includes(key)) {
                                descriptor.props.push(key);
                                
                                const typeStr = member.type ? member.type.getText(tsSource) : 'any';
                                const normalized = normalizeType(typeStr);

                                descriptor.propDefinitions[key] = {
                                    type: normalized,
                                    required: !member.questionToken
                                };
                            }
                        }
                    });
                    // Remove the Props declaration from the script to avoid runtime overhead
                    scriptContent = scriptContent.replace(node.getText(tsSource), '');
                }
            });

            // Extract extends: supports (var|let|const) extends = "button"
            const extendsMatch = scriptContent.match(/(?:var|let|const)\s+extends\s*=\s*['"`]([^'"`]+)['"`];?/);
            if (extendsMatch) {
                descriptor.extends = extendsMatch[1];
                scriptContent = scriptContent.replace(extendsMatch[0], '');
            }

            // Remove any defineCustomElement calls from the script content
            scriptContent = scriptContent.replace(/defineCustomElement\s*\([^)]+\);?/g, '');

            descriptor.script = {
                content: scriptContent.trim()
            };
        }
    }

    // 5. Extract Styles
    const styleRegex = /<style(\s+scoped)?>([\s\S]*?)<\/style>/g;
    let styleMatch;
    while ((styleMatch = styleRegex.exec(source)) !== null) {
        descriptor.styles.push({
            scoped: !!styleMatch[1],
            content: styleMatch[2].trim()
        });
    }

    // 6. Generate Scope ID
    if (descriptor.styles.some(s => s.scoped)) {
        descriptor.scopeId = hash(filename);
    }

    return descriptor;
}

function hash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
}