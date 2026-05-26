import { parse } from './sfc';
import { CompilerPlugin } from './plugin';
import { compileStyle } from './stylePlugin';
import { generate ,genSingleNode} from './codegenerate/generate';
import { transformElement } from './transform/transformElement';

import { Node, NodeTypes } from './ast';
import { cIfPlugin } from './directives/c-if';
import { cForPlugin } from './directives/c-for';
import { cBindPlugin } from './directives/c-bind';
import { cModelPlugin } from './directives/c-model';
import { cSlotPlugin } from './directives/c-slot';
import { cShowPlugin } from './directives/c-show'; 
import { cPortalPlugin } from './directives/c-portal';
import { cValidatePlugin } from './directives/c-validate';
import { cOncePlugin } from './directives/c-once';
import { processExpression } from './utils';

import { buttonClassPlugin } from './directives/button-class-plugin';

import * as ts from 'typescript';

/**
 * Simple transpiler to convert .can syntax to JavaScript
 */
export async function transpile(content: string, plugins: CompilerPlugin[] = [], filename: string = 'anonymous.can'): Promise<{ code: string; map?: string }> {
    const allPlugins = [ 
        cOncePlugin,
        cSlotPlugin,
        cShowPlugin, // Use the new cShowPlugin
        buttonClassPlugin, 
        cIfPlugin, 
        cForPlugin, 
        cBindPlugin, 
        cModelPlugin, 
        cPortalPlugin,
        cValidatePlugin,
        ...plugins
    ];
    // 0. Run Plugin Transforms (Pre)
    for (const plugin of allPlugins) {
        if (plugin.transform) {
            const result = plugin.transform(content, filename);
            if (result) content = result;
        }
    }

    const descriptor = parse(content, filename);
    const name = descriptor.name || 'AnonymousComponent';

    const imports = descriptor.imports || '';
    let script = descriptor.script ? descriptor.script.content : '';
    //const scriptExtra = descriptor.script_extra ? descriptor.script_extra.content : '';

 
    script = transformScript(script);

//     // 1. Fix class syntax (remove 'function' keyword and 'var/let/const' for properties)
//    script = script.replace(/(^|\s)function\s+(\w+)/g, '$1$2'); // function onMount() -> onMount()
//    script = script.replace(/(^|\s)(var|let|const)\s+(\w+)/g, '$1$3'); // var title = ... -> title = ...
   


    // 1. Transform destructuring: (var|let|const) { a, b } = call()
    // This is run first to avoid being processed by the simpler regex below.
    // /\b(var|let|const)\s*\{([\s\S]+?)\}\s*=\s*(.+?);/g, 
//      script = script.replace(/\b(var|let|const)\s*\{([\s\S]+?)\}\s*=\s*([\s\S]+?);/g,
   
//         (match: string, keyword: string, variables: string, hookCall: string) => {
//              // 1. Clean up the variables list
//             const keys = variables.split(',').map(v => v.trim()).filter(v=>v);
           
//             // Create a unique internal name for the hook result
//          // 2. Extract the hook name properly (e.g., useVirtualList)
//             const hookNameMatch = hookCall.match(/^(\w+)/);
//             const hookName = hookNameMatch ? hookNameMatch[1] : 'result';
              
//             // 3. Create the internal name
//             const internalName = `_hook_${hookName}`;

//              // 4. Build the output string
//             // We include the 'const' (or original keyword) to avoid global scope leaks
//            let output = `${keyword} ${internalName} = ${hookCall.trim()};\n`;

//             keys.forEach(key => {
//              // Note: Added 'const' here so the destructured vars are actually defined
//            output += `${keyword} ${key} = ${internalName}.${key};\n`;
//          });
//             return output;
//         }
//     );


// script = script.replace(/\b(var|let|const)\s*\[([\s\S]+?)\]\s*=\s*([\s\S]+?);/g, 
//         (match: string, keyword: string, variables: string, hookCall: string) => {
    
//         // 1. Clean up the variable names (count, dispatch)
//          const keys = variables.split(',').map(v => v.trim()).filter(v => v);

//     // 2. Extract hook name (e.g., useReducer)
//     const hookNameMatch = hookCall.match(/^(\w+)/);
//     const hookName = hookNameMatch ? hookNameMatch[1] : 'result';
//     const internalName = `_hook_${hookName}`;

//     // 3. Create the assignment for the hook call itself
//     let output = `${keyword} ${internalName} = ${hookCall.trim()};\n`;

//     // 4. Create index-based assignments for the array elements
//     keys.forEach((key, index) => {
//         // [count, dispatch] -> count = _hook[0], dispatch = _hook[1]
//         output += `${keyword} ${key} = ${internalName}[${index}];\n`;
//     });

//     return output;
// });

//     // 2. Remove var/let/const from simple declarations (e.g., var x = 1 or let y;)
//     // This is safer for things like `for (let i=0...)` because it requires a space or
//     // start of line before the keyword, which is not present inside `for (...)`.
//     script = script.replace(/(^|\s)(var|let|const)\s+([a-zA-Z_$][\w$]*)/g, '$1$3');

 



    // // 2. Map 'print' to 'console.log'
    // script = script.replace(/\bprint\(/g, 'console.log(');







    // 3. Process template
    const templateContent = descriptor.template ? descriptor.template.content : '';
    const domCode = generate(templateContent, descriptor.scopeId, allPlugins);

    // 4. Process Styles
    let cssInjectionCode = '';
    if (descriptor.styles.length > 0) {
        const cssPromises = descriptor.styles.map(async style => {
            if (style.scoped && descriptor.scopeId) {
                return await compileStyle(style.content, descriptor.scopeId);
            }
            return style.content;
        });
        const css = (await Promise.all(cssPromises)).join('\n');
        
        // Simple runtime injection
        cssInjectionCode = `
const _scopeId = '${descriptor.scopeId}';
let _style = document.querySelector(\`style[data-can-scope="\${_scopeId}"]\`);
if (!_style) {
    _style = document.createElement('style');
    _style.setAttribute('data-can-scope', _scopeId);
    document.head.appendChild(_style);
}
_style.textContent = \`${css.replace(/`/g, '\\`')}\`;`;
    }

   // Generate the output template
   const outputTemplate= `import { Component } from '../runtime-core/Component';
import { effect } from '../reactivity/effect';
import { useTransition } from '../runtime-core/animation';
import { createComponent } from '../runtime-core/componentUtils';
import { t } from '../runtime-core/i18n';
import { cHtml } from '../runtime-core/html';
import { getDirective } from '../runtime-core/directives/directiveRegistry'; // New import
import { cOn } from '../runtime-core/on';
import { cRef } from '../runtime-core/Cref';
import { defineCustomElement, nativeElementMap } from '../runtime-dom/customElement';
import { cModel } from '../runtime-core/directives/cModelRuntime';
import { cValidate } from '../runtime-core/directives/cValidateRuntime';
import { cPortal } from '../runtime-core/directives/cPortalRuntime';
${imports}

${cssInjectionCode}

const _kebabName = '${name}'.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const _tagName = _kebabName.includes('-') ? _kebabName : 'can-' + _kebabName;

const _rawProps = ${JSON.stringify(descriptor.props)};
const _observedAttrs = _rawProps.map(p => p.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase());

const _baseClass = ${descriptor.extends ? `nativeElementMap['${descriptor.extends}'] || Component` : 'Component'};

const _elementOptions = { 
  ${descriptor.extends ? `extends: '${descriptor.extends}'` : ''}
};

export class ${name} extends _baseClass {
  static extends = ${descriptor.extends ? `'${descriptor.extends}'` : 'null'};
  static get observedAttributes() { return _observedAttrs; }
  static get defaultProps() { return ${JSON.stringify(descriptor.defaultProps)}; }
  static get propDefinitions() { return ${JSON.stringify(descriptor.propDefinitions)}; }

 \n${script}\n    
render(): DocumentFragment {\n        
const root = document.createDocumentFragment();\n${domCode}\n
return root;\n    
}\n}
defineCustomElement(_tagName, ${name}, { ..._elementOptions, observedAttributes: _observedAttrs });`;


// // Transpile TypeScript to JavaScript using TypeScript compiler
    const transpiledOutput = ts.transpileModule(outputTemplate, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.ESNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            strict: true,
            esModuleInterop: true,
            skipLibCheck: false,
            noEmit: false,
            noEmitOnError: true,
            importHelpers:true,
            jsx: ts.JsxEmit.None,
             sourceMap: true,
            inlineSources: true
            
        }
    });

    return {
        code: transpiledOutput.outputText,
        map: transpiledOutput.sourceMapText
    };
}



export function transformScript(code: string): string {
    if (!code.trim()) return '';
    
    const sourceFile = ts.createSourceFile('script.ts', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  
    const printer = ts.createPrinter({ omitTrailingSemicolon: true });
    let output = '';

    // 1. AST Transformer for logic adjustments
    const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
        return (rootNode) => {
            function visit(node: ts.Node): ts.Node {
                // Transform print() -> console.log()
                if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'print') {
                    return ts.factory.updateCallExpression(
                        node,
                        ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('console'), 'log'),
                        node.typeArguments,
                        node.arguments
                    );
                }

                // Example: Transform onMount(() => {}) -> this.onMounted(() => {})
                // This is safer than the regex version
                const lifecycleMap: Record<string, string> = { 
                    'onMount': 'onMounted', 
                    'onCleanup': 'onCleanup' 
                };

                if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && lifecycleMap[node.expression.text]) {
                    return ts.factory.updateCallExpression(
                        node,
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createThis(),
                            lifecycleMap[node.expression.text]
                        ),
                        node.typeArguments,
                        node.arguments
                    );
                }
                return ts.visitEachChild(node, visit, context);
            }
            return ts.visitNode(rootNode, visit) as ts.SourceFile;
        };
    };

    const result = ts.transform(sourceFile, [transformer]);
    const transformedSourceFile = result.transformed[0];

    // 2. Convert statements to class members
    transformedSourceFile.statements.forEach(statement => {
        if (ts.isFunctionDeclaration(statement) && statement.name) {
            // function foo() {} -> foo() {}
            const decorators = (ts as any).getDecorators ? (ts as any).getDecorators(statement) : (statement as any).decorators;
            const modifiers = (ts as any).getModifiers ? (ts as any).getModifiers(statement) : statement.modifiers;
            const method = ts.factory.createMethodDeclaration(
                modifiers || decorators,
                statement.asteriskToken,
                statement.name,
                undefined,
                statement.typeParameters,
                statement.parameters,
                statement.type,
                statement.body
            );
            output += printer.printNode(ts.EmitHint.Unspecified, method, transformedSourceFile) + '\n';
        } else if (ts.isVariableStatement(statement)) {
            const decorators = (ts as any).getDecorators ? (ts as any).getDecorators(statement) : (statement as any).decorators;
            const modifiers = (ts as any).getModifiers ? (ts as any).getModifiers(statement) : statement.modifiers;

            statement.declarationList.declarations.forEach(decl => {
                if (ts.isIdentifier(decl.name)) {
                    // const x = 1 -> x = 1
                    const prop = ts.factory.createPropertyDeclaration(
                        modifiers || decorators,
                        decl.name,   
                        undefined,
                        decl.type,
                        decl.initializer
                    );
                    output += printer.printNode(ts.EmitHint.Unspecified, prop, transformedSourceFile) + '\n';
                } else {
                    // Destructuring: const { a } = hook()
                    // -> _hook_result = hook(); a = this._hook_result.a;
                    
                    let hookName = 'result';
                    if (decl.initializer && ts.isCallExpression(decl.initializer) && ts.isIdentifier(decl.initializer.expression)) {
                        hookName = decl.initializer.expression.text;
                    }
                    const tempName = `_hook_${hookName}`;
                    
                    const tempProp = ts.factory.createPropertyDeclaration(
                        modifiers,
                        tempName,
                        undefined,
                        undefined,
                        decl.initializer
                    );
                    output += printer.printNode(ts.EmitHint.Unspecified, tempProp, transformedSourceFile) + '\n';

                    const bindings: ts.PropertyDeclaration[] = [];
                    generateBindings(decl.name, ts.factory.createPropertyAccessExpression(ts.factory.createThis(), tempName), bindings, modifiers);
                    
                    bindings.forEach(b => {
                        output += printer.printNode(ts.EmitHint.Unspecified, b, transformedSourceFile) + '\n';
                    });
                }
            });
        } else {
            // Pass through other statements (e.g. expressions, side effects)
            output += printer.printNode(ts.EmitHint.Unspecified, statement, transformedSourceFile) + '\n';
        }
    });
    
    return output;
}

export function generateBindings(
    name: ts.BindingName, 
    accessExpr: ts.Expression, 
    outputNodes: ts.PropertyDeclaration[],
    modifiers?: ts.NodeArray<ts.ModifierLike>
) {
    if (ts.isIdentifier(name)) {
        outputNodes.push(ts.factory.createPropertyDeclaration(
             modifiers, name, undefined, undefined, accessExpr
        ));
    } else if (ts.isObjectBindingPattern(name)) {
        name.elements.forEach(el => {
            if (ts.isBindingElement(el)) {
                const propName = el.propertyName || el.name;
                let newAccess: ts.Expression | undefined;
                
                if (ts.isIdentifier(propName)) {
                     newAccess = ts.factory.createPropertyAccessExpression(accessExpr, propName);
                } else if (ts.isStringLiteral(propName) || ts.isNumericLiteral(propName)) {
                     newAccess = ts.factory.createElementAccessExpression(accessExpr, propName);
                } else if (ts.isComputedPropertyName(propName)) {
                     newAccess = ts.factory.createElementAccessExpression(accessExpr, propName.expression);
                }

                if (newAccess) {
                    generateBindings(el.name, newAccess, outputNodes, modifiers);
                }
            }
        });
    } else if (ts.isArrayBindingPattern(name)) {
        name.elements.forEach((el, index) => {
            if (ts.isBindingElement(el)) {
                 const newAccess = ts.factory.createElementAccessExpression(accessExpr, index);
                 generateBindings(el.name, newAccess, outputNodes, modifiers);
            }
        });
    }
}





// Endurance this code have not be apply

/**
 * Transform lifecycle hooks (onMount, onCleanup, onBeforeMount, etc.)
 */
export function transformLifecycleHooks(script: string): string {
    const lifecycleHooks: Record<string, string> = {
        'onMount': 'onMounted',
        'onCleanup': 'onCleanup',
        'onBeforeMount': 'onBeforeMount',
        'onUpdated': 'onUpdated',
        'onUnmounted': 'onUnmounted',
        'onErrorCaptured': 'onErrorCaptured',
    };
    
    for (const [from, to] of Object.entries(lifecycleHooks)) {
        // Match: onMount(() => {...}) or onMount(() => fn())
        const regex = new RegExp(`\\b${from}\\s*\\(\\s*(\\[?.*?\\]?)\\s*\\)`, 'g');
        script = script.replace(regex, (match, callback) => {
            return `${to}(() => ${callback.replace(/^\\[|\\]$/g, '')})`;
        });
    }
    
    return script;
}

/**
 * Transform provide/inject syntax
 */
export function transformProvideInject(script: string): string {
    // Transform: provide('key', value) -> provide('key', value)
    script = script.replace(/\bprovide\s*\(\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\)/g, 
        "provide('$1', $2)");
    
    // Transform: inject('key') -> inject('$1')
    script = script.replace(/\binject\s*\(\s*['"]([^'"]+)['"]\s*\)/g, "inject('$1')");
    
    // Transform: inject('key', defaultValue) -> inject('$1', $2)
    script = script.replace(/\binject\s*\(\s*['"]([^'"]+)['"]\s*,\s*([^)]+)\)/g, 
        "inject('$1', $2)");
    
    return script;
}

/**
 * Transform slot syntax (slot props and named slots)
 */
export function transformSlots(script: string): string {
    // Transform slot function declarations
    script = script.replace(/\bslot\s*\{/g, 'this.$slots[');
    script = script.replace(/\}\s*\}/g, ']}');
    
    // Handle slot props: slot({ prop }) -> slot['default']({ prop })
    script = script.replace(/\bslot\s*\(\s*\{([^}]+)\}\s*\)/g, "this.$slots['default']({$1})");
    
    return script;
}

/**
 * Transform computed expressions
 * Converts: computed(() => expr) -> computed(() => () => expr)
 */
export function transformComputed(script: string): string {
    return script.replace(/\bcomputed\s*\(\s*(\[[^\]]*\]|\([^\)]*\))\s*\)/g, (match, callback) => {
        return `computed(() => ${callback})`;
    });
}

/**
 * Transform watch expressions
 * Converts: watch(() => expr, (newVal, oldVal) => { ... })
 */
export function transformWatch(script: string): string {
    return script.replace(/\bwatch\s*\(\s*(\[[^\]]*\]|\([^\)]*\))\s*,\s*(\[[^\]]*\]|\([^\)]*\))\s*\)/g, 
        (match, getter, handler) => {
            return `watch(() => ${getter}, (newVal, oldVal) => ${handler})`;
        });
}

/**
 * Generate slot code for component children
 */
export function generateSlots(children: Node[], parentVar: string, idx: number, locals: string[], plugins: CompilerPlugin[]): { code: string; nextIndex: number } {
    let code = '';
    let currentIdx = idx;
    
    for (const child of children) {
        if (child.type === NodeTypes.ELEMENT && child.tag === 'slot') {
            const slotName = (child.props && (child.props as any)['name']) || 'default';
            const slotVar = `slot${currentIdx}`;
            
            code += `const ${slotVar} = this.$slots['${slotName}'];
`;
            code += `if (${slotVar}) {
`;
            code += `    ${slotVar}(${parentVar});
`;
            code += `}
`;
            currentIdx++;
        } else {
            const res = genSingleNode(child, `el${currentIdx}`, currentIdx + 1, true, parentVar, locals, false, plugins);
            code += res.code;
            currentIdx = res.nextIndex;
        }
    }
    
    return { code, nextIndex: currentIdx };
}

/**
 * Generate suspense/async component code
 */
export function generateSuspenseCode(asyncNodes: Node[], parentVar: string, idx: number, locals: string[], plugins: CompilerPlugin[]): { code: string; nextIndex: number } {
    let code = '';
    let currentIdx = idx;
    
    // Wrap async content in Suspense boundary
    code += `const suspense${currentIdx} = document.createElement('suspense-boundary');
`;
    code += `const suspenseRoot${currentIdx} = document.createDocumentFragment();
`;
    
    for (const node of asyncNodes) {
        const res = genSingleNode(node, `async${currentIdx}`, currentIdx + 1, true, `suspenseRoot${currentIdx}`, locals, false, plugins);
        code += res.code;
        currentIdx = res.nextIndex;
    }
    
    code += `suspense${currentIdx}.appendChild(suspenseRoot${currentIdx});
`;
    code += `${parentVar}.appendChild(suspense${currentIdx});
`;
    
    return { code, nextIndex: currentIdx + 1 };
}
