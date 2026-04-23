import { Node, NodeTypes } from '../ast';
import { parseTemplate } from '../parser';
import { transform } from '../transform/transform';
import { CompilerPlugin } from '../plugin';
import { processExpression } from '../utils'; 
import { getDirective } from '../../runtime-core/directives/directiveRegistry'; // New import

/**
 * Entry point for generating DOM manipulation code from an HTML template.
 */
export function generate(html: string, scopeId?: string, plugins: CompilerPlugin[] = []): string {
    const root = parseTemplate(html);
    transform(root, scopeId, plugins);
    return genChildren(root.children || [], 'root', 0, [], false, plugins).code;
}

export function genChildren(children: Node[], parentVar: string, startIndex: number, locals: string[] = [], isStatic: boolean = false, plugins: CompilerPlugin[] = []): { code: string, nextIndex: number } {
    let code = '';
    let idx = startIndex;

    for (const child of children) {
        if (child.type === NodeTypes.ELEMENT && child.ifCondition) {
            if (isStatic) {
                let chainNode: Node | undefined = child;
                let first = true;
                while (chainNode) {
                    const condition = chainNode.ifCondition;
                    const condStr = condition ? processExpression(condition, locals) : 'true';
                    
                    code += `  ${first ? '' : 'else '}if (${condStr}) {\n`;
                    
                    const elVar = `el${idx++}`;
                    const res = genSingleNode(chainNode, elVar, idx, true, parentVar, locals, true, plugins); 
                    code += res.code;
                    idx = res.nextIndex;
                    
                    code += `  }\n`;
                    
                    chainNode = chainNode.elseNode;
                    first = false;
                }
            } else {
                const anchorVar = `anchor${idx++}`;
                const currentElVar = `cur${idx++}`;
                
                code += `const ${anchorVar} = document.createComment("if");\n`;
                code += `${parentVar}.appendChild(${anchorVar});\n`;
                code += `let ${currentElVar} = null;\n`;
                
                code += `effect(() => {\n`;
                code += `  if (${currentElVar}) { ${currentElVar}.remove(); ${currentElVar} = null; }\n`;
                
                let chainNode: Node | undefined = child;
                let first = true;
                
                while (chainNode) {
                    const condition = chainNode.ifCondition;
                    const condStr = condition ? processExpression(condition, locals) : 'true';
                    
                    code += `  ${first ? '' : 'else '}if (${condStr}) {\n`;
                    
                    const elVar = `el${idx++}`;
                    const res = genSingleNode(chainNode, elVar, idx, false, undefined, locals, false, plugins); 
                    code += res.code;
                    idx = res.nextIndex;
                    
                    code += `    ${currentElVar} = ${elVar};\n`;
                    code += `    ${anchorVar}.parentNode.insertBefore(${elVar}, ${anchorVar});\n`;
                    code += `  }\n`;
                    
                    chainNode = chainNode.elseNode;
                    first = false;
                }
                code += `});\n`;
            }
            
        } else if (child.type === NodeTypes.ELEMENT && child.forLoop) {
            const { alias, source } = child.forLoop;
            const sourceExpr = locals.includes(source) ? source : `this.${source}`;

            if (isStatic) {
                code += `  const items = ${sourceExpr};\n`;
                code += `  if (Array.isArray(items)) {\n`;
                code += `    items.forEach((${alias}, index) => {\n`;
                
                const elVar = `el${idx++}`;
                const res = genSingleNode(child, elVar, idx, true, parentVar, [...locals, alias, 'index'], true, plugins);
                code += res.code;
                idx = res.nextIndex;
                code += `    });\n`;
                code += `  }\n`;
            } else {
                const anchorVar = `anchor${idx++}`;
                const listVar = `list${idx++}`;
                
                code += `const ${anchorVar} = document.createComment("for");\n`;
                code += `${parentVar}.appendChild(${anchorVar});\n`;
                code += `let ${listVar} = [];\n`;
                
                code += `effect(() => {\n`;
                code += `  ${listVar}.forEach(el => el.remove());\n`;
                code += `  ${listVar} = [];\n`;
                
                code += `  const items = ${sourceExpr};\n`;
                code += `  if (Array.isArray(items)) {\n`;
                code += `    items.forEach((${alias}, index) => {\n`;
                
                const elVar = `el${idx++}`;
                const res = genSingleNode(child, elVar, idx, false, undefined, [...locals, alias, 'index'], false, plugins);
                code += res.code;
                idx = res.nextIndex;
                
                code += `      ${anchorVar}.parentNode.insertBefore(${elVar}, ${anchorVar});\n`;
                code += `      ${listVar}.push(${elVar});\n`;
                code += `    });\n`;
                code += `  }\n`;
                code += `});\n`;
            }
        } else {
            const elVar = child.type === NodeTypes.ELEMENT ? `el${idx++}` : `txt${idx++}`;
            const res = genSingleNode(child, elVar, idx, true, parentVar, locals, isStatic, plugins);
            code += res.code;
            idx = res.nextIndex;
        }
    }
    return { code, nextIndex: idx };
}

export function genSingleNode(node: Node, varName: string, startIndex: number, append: boolean, parentVar?: string, locals: string[] = [], isStatic: boolean = false, plugins: CompilerPlugin[] = []): { code: string, nextIndex: number } {
    let code = '';
    let idx = startIndex;
    
    if (node.type === NodeTypes.TEXT) {
        const text = node.content || '';
        if (text.includes('{{')) {
             const expr: string = '`' + text.replace(/{{(.*?)}}/g, (_match: string, p1: string) => {
                return '${' + processExpression(p1.trim(), locals) + '}';
            }) + '`';
            code += `const ${varName} = document.createTextNode("");\n`;
            if (isStatic) {
                code += `${varName}.data = ${expr};\n`;
            } else {
                code += `effect(() => ${varName}.data = ${expr});\n`;
            }
        } else {
            code += `const ${varName} = document.createTextNode(${JSON.stringify(text)});\n`;
        }
        if (append && parentVar) {
            code += `${parentVar}.appendChild(${varName});\n`;
        }
        return { code, nextIndex: idx };
    }
    
    if (node.type === NodeTypes.ELEMENT) {
        if (node.props && 'c-once' in node.props) {
            isStatic = true;
            delete node.props['c-once'];
        }

        const tagName = node.tag!;
        const isComponent = /^[A-Z]/.test(tagName);
        
        if (isComponent) {
            code += `const ${varName} = createComponent(${tagName}, {});\n`;
        } else {
            code += `const ${varName} = document.createElement("${tagName}");\n`;
        }
        
        if (node.props) {
            for (const [key, value] of Object.entries(node.props)) {
                let pluginHandled = false;
                for (const plugin of plugins) {
                    if (plugin.processDirective) {
                        const res = plugin.processDirective(key, value as string, { varName, isStatic, locals, processExpression });
                        if (res) {
                            code += res;
                            pluginHandled = true;
                            break;
                        }
                    }
                }
                if (pluginHandled) continue;

                // Check for custom runtime directives (e.g., c-my-directive, c-my-directive:arg.mod)
                // Exclude built-in compiler-handled directives that might start with 'c-'
                if (key.startsWith('c-') && !key.startsWith('c-bind:') && !key.startsWith('c-on:') && !key.startsWith('c-ref') && !key.startsWith('c-html') && !key.startsWith('c-text') && !key.startsWith('c-memo') && !key.startsWith('c-cloak') && !key.startsWith('c-slot')) {
                    const parts = key.split(':');
                    const directiveNameWithMods = parts[0].substring(2); // e.g., 'my-directive.mod'
                    const directiveArg = parts.length > 1 ? parts[1].split('.')[0] : undefined;
                    
                    const nameParts = directiveNameWithMods.split('.');
                    const directiveName = nameParts[0]; // e.g., 'my-directive'
                    const directiveModifiers: Record<string, boolean> = {};
                    nameParts.slice(1).forEach(mod => directiveModifiers[mod] = true);

                    const processedValue = processExpression(value as string, locals);
                    
                    // Generate the binding object
                    const bindingVar = `_binding_${varName}_${directiveName}`;
                    code += `const ${bindingVar} = {
                        value: ${processedValue},
                        arg: ${directiveArg ? JSON.stringify(directiveArg) : 'undefined'},
                        modifiers: ${JSON.stringify(directiveModifiers)},
                        instance: this
                    };\n`;

                    // Generate code to call the directive's mounted hook
                    code += `const _dir_${directiveName} = getDirective(${JSON.stringify(directiveName)});\n`;
                    code += `if (_dir_${directiveName} && _dir_${directiveName}.mounted) {\n`;
                    code += `  _dir_${directiveName}.mounted(${varName}, ${bindingVar});\n`;
                    code += `}\n`;

                    // If the directive has an updated hook, wrap it in an effect
                    code += `if (_dir_${directiveName} && _dir_${directiveName}.updated) {\n`;
                    code += `  let _oldValue_${directiveName} = ${processedValue};\n`;
                    code += `  effect(() => {\n`;
                    code += `    const _newValue_${directiveName} = ${processedValue};\n`;
                    code += `    if (_newValue_${directiveName} !== _oldValue_${directiveName}) {\n`;
                    code += `      const _updatedBinding_${directiveName} = { ...${bindingVar}, value: _newValue_${directiveName}, oldValue: _oldValue_${directiveName} };\n`;
                    code += `      _dir_${directiveName}.updated(${varName}, _updatedBinding_${directiveName});\n`;
                    code += `      _oldValue_${directiveName} = _newValue_${directiveName};\n`;
                    code += `    }\n`;
                    code += `  });\n`;
                    code += `}\n`;
                    
                    continue; // Directive handled
                }

                if (key.startsWith('c-bind:')) {
                    if (typeof value !== 'string') continue;
                    const attr: string = key.slice(7);
                    let expr: string  = value;
                    if (expr.startsWith('{') && expr.endsWith('}') && !expr.includes(':')) {
                        expr = expr.slice(1, -1).trim();
                    }
                    
                    const processedExpr = processExpression(expr, locals);
                    code += `cBind(${varName}, "${attr}", () => ${processedExpr});\n`;
                } else if (key.startsWith('on')) {
                     if (typeof value !== 'string') continue;
                     const rawEvent = key.slice(2).toLowerCase();
                     const [event, ...modifiers] = rawEvent.split('.');
                     
                     let handler: string = value;
                     if (handler.startsWith('{') && handler.endsWith('}')) handler = handler.slice(1, -1).trim();
                     else if (!handler.includes('=>') && !handler.includes('function')) handler = `this.${handler}.bind(this)`;
                     
                     if (modifiers.length > 0) {
                         code += `cOn(${varName}, "${event}", ${handler}, ${JSON.stringify(modifiers)});\n`;
                     } else {
                         code += `${varName}.addEventListener("${event}", ${handler});\n`;
                     }
                } else if (key === 't') {
                     if (typeof value !== 'string') continue;
                     if (isStatic) {
                         code += `${varName}.textContent = t(${JSON.stringify(value)});\n`;
                     } else {
                         code += `effect(() => ${varName}.textContent = t(${JSON.stringify(value)}));\n`;
                     }
                } else if (key === 'c-html') {
                     if (typeof value !== 'string') continue;
                     const processedExpr = processExpression(value, locals);
                     if (isStatic) {
                         code += `cHtml(${varName}, ${processedExpr});\n`;
                     } else {
                         code += `cHtml(${varName}, () => ${processedExpr});\n`;
                     }
                } else if (key === 'c-text') {
                     if (typeof value !== 'string') continue;
                     const processedExpr = processExpression(value, locals);
                     if (isStatic) {
                         code += `${varName}.textContent = ${processedExpr};\n`;
                     } else {
                         code += `effect(() => ${varName}.textContent = ${processedExpr});\n`;
                     }
                } else if (key === 'c-ref') {
                     if (typeof value !== 'string') continue;
                     const isIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value);
                     const refExpr = (isIdentifier && !locals.includes(value)) ? `this.${value}` : value;
                     code += `cRef(${varName}, ${refExpr});\n`;
                } else if (key === 'c-memo') {
                    if (typeof value !== 'string') continue;
                    const deps = value.split(',').map(d => d.trim());
                    const depExpr = deps.map(d => processExpression(d, locals)).join(', ');
                     code +=`// c-memo directive - dependencies: [${depExpr}]`;
                }else if (key === 'c-cloak') {
                       code +=`${varName}.removeAttribute('c-cloak');`;
                }else if (key === 'c-slot'){
                     if (typeof value !== 'string') continue;
                     const slotName = value || 'default';
                     code+=`${varName}.setAttribute('data-slot', '${slotName}');`;
                }else if (key.startsWith('animate:')) {
                     if (typeof value !== 'string') continue;
                     const animName: string = key.split(':')[1];
                     let condition: string = value;
                     if (condition.startsWith('{') && condition.endsWith('}')) condition = condition.slice(1, -1).trim();
                     const condExpr = processExpression(condition, locals);
                     code += `const ${varName}_trans = useTransition(${varName}, "${animName}");\n`;
                     if (isStatic) {
                         code += `  if (${condExpr}) ${varName}_trans.enter();\n`;
                         code += `  else ${varName}_trans.leave();\n`;
                     } else {
                         code += `effect(() => {\n`;
                     code += `  if (${condExpr}) ${varName}_trans.enter();\n`;
                     code += `  else ${varName}_trans.leave();\n`;
                     code += `});\n`;
                     }
                } else if (isComponent) {
                     if (typeof value !== 'string') continue;
                     code += `${varName}.props["${key}"] = ${value.startsWith('{') ? value.slice(1, -1) : JSON.stringify(value)};\n`;
                } else {
                     if (typeof value === 'string' && value.includes('{{')) {
                        const expr: string = '`' + value.replace(/{{(.*?)}}/g, (_match: string, p1: string) => {
                            return '${' + processExpression(p1.trim(), locals) + '}';
                        }) + '`';
                        if (isStatic) {
                            code += `${varName}.setAttribute("${key}", ${expr});\n`;
                        } else {
                            code += `effect(() => ${varName}.setAttribute("${key}", ${expr}));\n`;
                        }
                     } else {
                        code += `${varName}.setAttribute("${key}", ${JSON.stringify(String(value))});\n`;
                     }
                }
            }
        }
        
        if (append && parentVar) {
            code += `${parentVar}.appendChild(${varName});\n`;
        }
        
        if (node.children) {
            const childrenRes = genChildren(node.children, varName, idx, locals, isStatic, plugins);
            code += childrenRes.code;
            idx = childrenRes.nextIndex;
        }
        
        return { code, nextIndex: idx };
    }
    return { code, nextIndex: idx };
}