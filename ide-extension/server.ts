import * as path from 'path';
import * as fs from 'fs';
import {
    createConnection,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity,
    DocumentHighlight,
    DocumentHighlightKind,
    ProposedFeatures,
    InitializeParams,
    TextDocumentSyncKind,
    InitializeResult,
    CompletionItem,
    CompletionItemKind,
    LinkedEditingRanges,
    LinkedEditingRangeParams,
    Range,
    InsertTextFormat,
    TextDocumentPositionParams,
    TextEdit,
    DocumentFormattingParams,
    Definition,
    Location,
    CompletionList
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { fileURLToPath, pathToFileURL } from 'url';

import { transpile } from '../src/compiler/codegen';
import { defaultPlugins } from '../src/cli/build';

// Create a connection for the server, using Node's IPC as a transport.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion
            completionProvider: {
                resolveProvider: true
            },
            // Tell the client that this server supports hover information
            hoverProvider: true,
            // Tell the client that this server supports document formatting
            documentFormattingProvider: true,
            // Tell the client that this server supports highlighting matching symbols
            documentHighlightProvider: true,
            // Tell the client that this server supports "Go to Definition"
            definitionProvider: true,
            linkedEditingRangeProvider: true,
            semanticTokensProvider: {
                legend: {
                    tokenTypes: ['keyword', 'variable', 'function', 'parameter', 'property', 'class', 'macro'],
                    tokenModifiers: ['declaration', 'readonly']
                },
                full: true
            }
        }
    };
    return result;
});

/**
 * Hover Logic: Provides documentation when hovering over keywords.
 */
connection.onHover((params: TextDocumentPositionParams) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);
    
    // Find the word at the current position
    const wordMatch = text.slice(0, offset).match(/([@a-zA-Z0-9_-]+)$/);
    const wordRest = text.slice(offset).match(/^([a-zA-Z0-9_-]+)/);
    let word = (wordMatch ? wordMatch[0] : '') + (wordRest ? wordRest[0] : '');
    
    // Normalize word for lookup
    const lookupWord = word.startsWith('@') ? word.slice(1) : word;

    const docs: Record<string, string> = {
        'component': '**Can Component**\n\nDefines a new UI component with encapsulated logic and styles.',
        'signal': '**Reactive Signal**\n\nCreates a reactive value that updates the UI when changed.',
        'template': '**Component Template**\n\nDefines the HTML structure for the component.',
        'computed': '**Derived State**\n\nCreates a read-only reactive value that updates when its dependencies change.',
        'effect': '**Side Effect**\n\nRuns a function and automatically re-runs it when reactive dependencies change.',
        'c-if': '**Directive: c-if (Conditional Rendering)**\n\nConditionally renders an element by adding or removing it from the DOM. Use `c-if` for content that doesn\'t change often, as it has a higher toggle cost but lower initial cost if the condition is false.',
        'c-else-if': '**Directive: c-else-if**\n\nDenotes the "else if block" for `c-if`. Must be a sibling of `c-if` or another `c-else-if`.',
        'c-else': '**Directive: c-else**\n\nDenotes the final "else block" for `c-if`. Must be a sibling of `c-if` or `c-else-if`.',
        'c-for': '**Directive: c-for**\n\nRenders a list of items based on an array. Syntax: `item in items`.',
        'c-model': '**Directive: c-model**\n\nEstablishes two-way data binding on form inputs.',
        'c-show': '**Directive: c-show (Visibility Toggle)**\n\nToggles element visibility using the CSS `display` property. Unlike `c-if`, the element remains in the DOM regardless of the condition. Use `c-show` for elements that toggle frequently.'
    };

    if (docs[lookupWord]) {
        return {
            contents: {
                kind: 'markdown',
                value: docs[lookupWord]
            }
        };
    }

    return null;
});

/**
 * Completion Logic: Provides intelligent suggestions based on context.
 */
connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] | CompletionList | null => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const offset = document.offsetAt(params.position);
    const prefix = text.slice(0, offset);

    // 1. CSS Context
    const inStyle = prefix.lastIndexOf('<style') > prefix.lastIndexOf('</style>');
    if (inStyle) {
        const cssProps = [
            'color', 'background', 'margin', 'padding', 'display', 'flex', 'opacity', 
            'width', 'height', 'border', 'font-family', 'font-size', 'position', 'cursor'
        ];

        const lastColon = prefix.lastIndexOf(':');
        const lastSemicolon = prefix.lastIndexOf(';');
        if (lastColon > lastSemicolon) {
            return ['block', 'flex', 'none', 'inline-block', 'relative', 'absolute', 'pointer'].map(v => ({
                label: v, kind: CompletionItemKind.Value
            }));
        }

        return cssProps.map(prop => ({ label: prop, kind: CompletionItemKind.Property }));
    }

    // 2. HTML Template Context
    const templateRegex = /(?:var|this\.|let|const)?\s*template\s*[:=]\s*`/g;
    let templateMatch;
    let lastTemplateStart = -1;
    while ((templateMatch = templateRegex.exec(prefix)) !== null) {
        lastTemplateStart = templateMatch.index + templateMatch[0].length;
    }
    const templateEnd = text.indexOf('`;', lastTemplateStart);
    const inTemplate = lastTemplateStart !== -1 && (templateEnd === -1 || templateEnd > offset);

    if (inTemplate) {
        const lastOpenBracket = prefix.lastIndexOf('<');
        const lastCloseBracket = prefix.lastIndexOf('>');

        // 2.0 Suggest Closing Tag: </|
        if (prefix.endsWith('</')) {
            const tags = prefix.match(/<([a-zA-Z0-9-]+)/g) || [];
            const openTags: string[] = [];
            tags.forEach(t => {
                const name = t.slice(1);
                if (prefix.lastIndexOf(`<${name}`) > prefix.lastIndexOf(`</${name}`)) {
                    openTags.push(name);
                }
            });
            if (openTags.length > 0) {
                const lastTag = openTags[openTags.length - 1];
                return [{
                    label: lastTag,
                    kind: CompletionItemKind.Snippet,
                    insertText: `${lastTag}>`,
                    detail: `Close ${lastTag}`
                }];
            }
        }

        if (lastOpenBracket > lastCloseBracket) {
            const textAfterOpen = prefix.slice(lastOpenBracket + 1);

            // 2.1 Tag name completion: <| or <div|
            if (!textAfterOpen.includes(' ')) {
                const tags = [
                    'div', 'span', 'p', 'button', 'input', 'h1', 'h2', 'h3', 'ul', 'li', 'a', 'img', 'form', 'label', 'select', 'textarea', 'section', 'header', 'footer', 'slot', 'template'
                ];
                return tags.map(tag => ({
                    label: tag,
                    kind: CompletionItemKind.Snippet,
                    insertText: tag,
                    insertTextFormat: InsertTextFormat.Snippet
                }));
            }

            // 2.2 Attribute/Directive completion: <div |
            const attrValueMatch = textAfterOpen.match(/([a-z-]+)=["']([^"']*)$/);
            const inAttrValue = !!attrValueMatch;
            
            if (inAttrValue && attrValueMatch) {
                const attrNameMatch = attrValueMatch[1].match(/([a-z-]+)$/);
                if (attrNameMatch) {
                    const attrName = attrNameMatch[1];
                    if (attrName === 'type') {
                        return ['text', 'password', 'number', 'email', 'checkbox', 'radio', 'submit', 'button', 'file', 'range', 'date'].map(v => ({
                            label: v, kind: CompletionItemKind.Value
                        }));
                    }
                    if (attrName === 'method') {
                        return ['GET', 'POST'].map(v => ({ label: v, kind: CompletionItemKind.Value }));
                    }
                }
                return [];
            }
            
            if (textAfterOpen.includes(' ')) {
                const globalAttrs = [
                    { label: 'class', detail: 'CSS classes' },
                    { label: 'id', detail: 'Unique identifier' },
                    { label: 'style', detail: 'Inline styles' },
                    { label: 'title', detail: 'Advisory information' },
                    { label: 'placeholder', detail: 'Input hint' },
                    { label: 'type', detail: 'Input type' },
                    { label: 'value', detail: 'Input value' },
                    { label: 'name', detail: 'Form field name' },
                    { label: 'href', detail: 'Hyperlink reference' },
                    { label: 'src', detail: 'Source URL' },
                    { label: 'alt', detail: 'Alternative text' },
                    { label: 'disabled', detail: 'Disable element', insertText: 'disabled' },
                    { label: 'required', detail: 'Required field', insertText: 'required' },
                    { label: 'readonly', detail: 'Read-only field', insertText: 'readonly' }
                ];

                const directives = [
                    { label: 'c-if', detail: 'Conditional rendering', insertText: 'c-if="${1:condition}"' },
                    { label: 'c-else-if', detail: 'Conditional else-if', insertText: 'c-else-if="${1:condition}"' },
                    { label: 'c-else', detail: 'Conditional else', insertText: 'c-else' },
                    { label: 'c-for', detail: 'List rendering', insertText: 'c-for="${1:item} in ${2:items}"' },
                    { label: 'c-model', detail: 'Two-way binding', insertText: 'c-model="${1:signal}"' },
                    { label: 'c-show', detail: 'Toggle visibility (CSS display)', insertText: 'c-show="${1:condition}"' },
                    { label: 'c-bind', detail: 'Attribute binding', insertText: 'c-bind:${1:attr}="${2:value}"' },
                    { label: 'c-on', detail: 'Event handler', insertText: 'c-on:${1:click}="${2:handler}"' },
                    { label: 'c-mount', detail: 'Lifecycle: mounted hook', insertText: 'c-mount="${1:handler}"' },
                    { label: 'c-update', detail: 'Side effect on update', insertText: 'c-update="${1:effect}"' },
                    { label: 'c-text', detail: 'Text content binding', insertText: 'c-text="${1:value}"' },
                    { label: 'c-html', detail: 'HTML content binding', insertText: 'c-html="${1:value}"' },
                    { label: 'c-memo', detail: 'Memoize DOM subtree', insertText: 'c-memo="${1:deps}"' },
                    { label: 'c-cloak', detail: 'Hide uncompiled template', insertText: 'c-cloak' },
                    { label: 'c-ref', detail: 'Template reference', insertText: 'c-ref="${1:name}"' },
                    { label: 'c-once', detail: 'Render only once (static)', insertText: 'c-once' },
                    { label: 'c-portal', detail: 'Teleport element to target', insertText: 'c-portal="${1:target}"' },
                    { label: 'c-validate', detail: 'Form validation rules', insertText: 'c-validate="{ required: ${1:true} }"' },
                    { label: 'c-slot', detail: 'Named slot', insertText: 'c-slot:${1:name}' },
                    { label: 'animate:', detail: 'Declarative animation', insertText: 'animate:${1:fade}="${2:condition}"' }
                ];

                return [
                    ...globalAttrs.map(a => ({
                        label: a.label, kind: CompletionItemKind.Property, detail: a.detail,
                        insertText: a.insertText || `${a.label}="$1"`, insertTextFormat: InsertTextFormat.Snippet
                    })),
                    ...directives.map(d => ({
                        label: d.label, kind: CompletionItemKind.Keyword, detail: d.detail,
                        insertText: d.insertText, insertTextFormat: InsertTextFormat.Snippet
                    }))
                ];
            }
        }

        // 2.3 Between tags or starting a tag: suggest HTML elements as snippets
        const elements = [
            'div', 'span', 'p', 'button', 'input', 'h1', 'h2', 'h3', 'ul', 'li', 'a', 
            'section', 'article', 'nav', 'header', 'footer', 'main', 'aside', 'form', 
            'label', 'select', 'option', 'textarea', 'img', 'table', 'tr', 'td', 'slot'
        ];

        return elements.map(tag => ({
            label: tag,
            kind: CompletionItemKind.Snippet,
            insertText: `<${tag}>$0</${tag}>`,
            insertTextFormat: InsertTextFormat.Snippet,
            detail: `HTML <${tag}> element`
        }));
    }

    // 3. Script Context
    return [
        { 
            label: 'component-boilerplate', 
            kind: CompletionItemKind.Snippet,
            detail: 'Create a new Can component',
            insertText: [
                'component ${1:MyComponent} {',
                '    var template = `',
                '        <div>',
                '            $0',
                '        </div>',
                '    `;',
                '}'
            ].join('\n'),
            insertTextFormat: InsertTextFormat.Snippet
        },
        { label: 'component', kind: CompletionItemKind.Keyword },
        { label: 'signal', kind: CompletionItemKind.Function, detail: 'Create a reactive signal' },
        { label: 'computed', kind: CompletionItemKind.Function, detail: 'Create a derived reactive value' },
        { label: 'effect', kind: CompletionItemKind.Function, detail: 'Register a side effect' },
        { label: 'onMount', kind: CompletionItemKind.Function, detail: 'Lifecycle: component connected' },
        { label: 'onUnmounted', kind: CompletionItemKind.Function, detail: 'Lifecycle: component disconnected' },
        { label: 'onUpdated', kind: CompletionItemKind.Function, detail: 'Lifecycle: component updated' },
        { label: 'props', kind: CompletionItemKind.Variable, detail: 'Reactive component attributes' },
        { label: 'this.', kind: CompletionItemKind.Keyword, detail: 'Access component instance' }
    ];
});

// This handler resolves additional information for the item selected in the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
    return item;
});

/**
 * Linked Editing: Supports auto-renaming of HTML tags.
 */
connection.languages.onLinkedEditingRange((params: LinkedEditingRangeParams): LinkedEditingRanges | null => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    // 1. Identify the tag name under the cursor
    const prefix = text.slice(0, offset);
    const openMatch = prefix.match(/<([a-zA-Z0-9-]*)$/);
    const closeMatch = prefix.match(/<\/([a-zA-Z0-9-]*)$/);

    let isClosing = false;
    let nameStartOffset = -1;

    if (closeMatch) {
        isClosing = true;
        nameStartOffset = offset - closeMatch[1].length;
    } else if (openMatch) {
        isClosing = false;
        nameStartOffset = offset - openMatch[1].length;
    } else {
        return null;
    }

    const restMatch = text.slice(offset).match(/^[a-zA-Z0-9-]*/);
    const tagName = (isClosing ? closeMatch![1] : openMatch![1]) + (restMatch ? restMatch[0] : "");
    if (!tagName) return null;

    // Do not link void elements (they have no closing tag)
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    if (voidElements.includes(tagName.toLowerCase())) return null;

    const ranges: Range[] = [];
    // Add the current tag name range
    ranges.push({
        start: document.positionAt(nameStartOffset),
        end: document.positionAt(nameStartOffset + tagName.length)
    });

    if (isClosing) {
        // Search backwards for the corresponding opening tag
        let depth = 0;
        let i = nameStartOffset - 2;
        while (i >= 0) {
            if (text.slice(i, i + tagName.length + 1) === `<${tagName}` && !/[a-zA-Z0-9-]/.test(text[i + tagName.length + 1] || "")) {
                if (depth === 0) {
                    ranges.push({ start: document.positionAt(i + 1), end: document.positionAt(i + 1 + tagName.length) });
                    break;
                }
                depth--;
            } else if (text.slice(i, i + tagName.length + 2) === `</${tagName}` && !/[a-zA-Z0-9-]/.test(text[i + tagName.length + 2] || "")) {
                depth++;
            }
            i--;
        }
    } else {
        // Search forwards for the corresponding closing tag
        let depth = 0;
        let i = nameStartOffset + tagName.length;
        while (i < text.length) {
            if (text.slice(i, i + tagName.length + 2) === `</${tagName}` && !/[a-zA-Z0-9-]/.test(text[i + tagName.length + 2] || "")) {
                if (depth === 0) {
                    ranges.push({ start: document.positionAt(i + 2), end: document.positionAt(i + 2 + tagName.length) });
                    break;
                }
                depth--;
            } else if (text.slice(i, i + tagName.length + 1) === `<${tagName}` && !/[a-zA-Z0-9-]/.test(text[i + tagName.length + 1] || "")) {
                depth++;
            }
            i++;
        }
    }

    return ranges.length === 2 ? { ranges } : null;
});

/**
 * Document Highlight: Highlights matching opening and closing tags.
 */
connection.onDocumentHighlight((params: TextDocumentPositionParams): DocumentHighlight[] | null => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);

    // 1. Identify the tag name under the cursor (reuse logic from linked editing)
    const prefix = text.slice(0, offset);
    const openMatch = prefix.match(/<([a-zA-Z0-9-]*)$/);
    const closeMatch = prefix.match(/<\/([a-zA-Z0-9-]*)$/);

    let isClosing = false;
    let nameStartOffset = -1;

    if (closeMatch) {
        isClosing = true;
        nameStartOffset = offset - closeMatch[1].length;
    } else if (openMatch) {
        isClosing = false;
        nameStartOffset = offset - openMatch[1].length;
    } else {
        return null;
    }

    const restMatch = text.slice(offset).match(/^[a-zA-Z0-9-]*/);
    const tagName = (isClosing ? closeMatch![1] : openMatch![1]) + (restMatch ? restMatch[0] : "");
    if (!tagName) return null;

    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    if (voidElements.includes(tagName.toLowerCase())) return null;

    const highlights: DocumentHighlight[] = [];
    
    // Add the current tag name range
    highlights.push({
        range: {
            start: document.positionAt(nameStartOffset),
            end: document.positionAt(nameStartOffset + tagName.length)
        },
        kind: DocumentHighlightKind.Text
    });

    if (isClosing) {
        // Search backwards for the corresponding opening tag
        let depth = 0;
        let i = nameStartOffset - 2;
        while (i >= 0) {
            if (text.slice(i, i + tagName.length + 1) === `<${tagName}` && !/[a-zA-Z0-9-]/.test(text[i + tagName.length + 1] || "")) {
                if (depth === 0) {
                    highlights.push({ range: { start: document.positionAt(i + 1), end: document.positionAt(i + 1 + tagName.length) }, kind: DocumentHighlightKind.Text });
                    break;
                }
                depth--;
            } else if (text.slice(i, i + tagName.length + 2) === `</${tagName}` && !/[a-zA-Z0-9-]/.test(text[i + tagName.length + 2] || "")) {
                depth++;
            }
            i--;
        }
    } else {
        // Search forwards for the corresponding closing tag
        let depth = 0;
        let i = nameStartOffset + tagName.length;
        while (i < text.length) {
            if (text.slice(i, i + tagName.length + 2) === `</${tagName}` && !/[a-zA-Z0-9-]/.test(text[i + tagName.length + 2] || "")) {
                if (depth === 0) {
                    highlights.push({ range: { start: document.positionAt(i + 2), end: document.positionAt(i + 2 + tagName.length) }, kind: DocumentHighlightKind.Text });
                    break;
                }
                depth--;
            } else if (text.slice(i, i + tagName.length + 1) === `<${tagName}` && !/[a-zA-Z0-9-]/.test(text[i + tagName.length + 1] || "")) {
                depth++;
            }
            i++;
        }
    }

    return highlights.length === 2 ? highlights : null;
});

/**
 * Definition Logic: Resolve component paths and imports.
 */
connection.onDefinition((params: TextDocumentPositionParams): Definition | null => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const offset = document.offsetAt(params.position);
    const lines = text.split(/\r?\n/);
    const line = lines[params.position.line];

    // Get word under cursor
    const wordMatchAtPos = line.slice(0, params.position.character).match(/[@a-zA-Z0-9_-]+$/);
    const wordRestAtPos = line.slice(params.position.character).match(/^[a-zA-Z0-9_-]+/);
    const word = (wordMatchAtPos ? wordMatchAtPos[0] : '') + (wordRestAtPos ? wordRestAtPos[0] : '');

    // 1. Resolve relative imports
    const importMatch = line.match(/from\s+['"](\..+?)['"]/);
    if (importMatch) {
        const targetPathRaw = importMatch[1];
        const targetPath = targetPathRaw.endsWith('.can') ? targetPathRaw : `${targetPathRaw}.can`;
        const fullPath = path.resolve(path.dirname(fileURLToPath(params.textDocument.uri)), targetPath);

        if (fs.existsSync(fullPath)) {
            return Location.create(pathToFileURL(fullPath).toString(), { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } });
        }
    }

    // 2. Resolve Definitions (Internal Signals/Methods or Components)
    if (word) {
        const cleanWord = word.startsWith('@') ? word.slice(1) : word;

        // 2.1 Internal search for signals, variables, or functions in the current file
        const declarationRegex = new RegExp(`\\b(?:var|let|const|function)\\s+${cleanWord}\\b|\\b${cleanWord}\\s*\\(`, 'g');
        let match;
        while ((match = declarationRegex.exec(text)) !== null) {
            // If we're on the declaration itself, don't jump to it
            if (match.index <= offset && offset <= match.index + match[0].length) continue;

            return Location.create(document.uri, {
                start: document.positionAt(match.index),
                end: document.positionAt(match.index + match[0].length)
            });
        }

        // 2.2 Resolve Component Tags or Class Names (External files)
        // Convert kebab-case to PascalCase if needed
        const componentName = word.includes('-') 
            ? word.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
            : word;
        
        const dir = path.dirname(fileURLToPath(params.textDocument.uri));
        const extensions = ['.can', '.ts', '.js'];
        
        for (const ext of extensions) {
            const possibleFile = path.join(dir, `${componentName}${ext}`);
            if (fs.existsSync(possibleFile)) {
                return Location.create(pathToFileURL(possibleFile).toString(), { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } });
            }
        }
    }

    return null;
});

/**
 * Formatting Logic: Provides automatic indentation for .can files.
 */
connection.onDocumentFormatting((params: DocumentFormattingParams): TextEdit[] => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return [];

    const edits: TextEdit[] = [];
    const text = document.getText();
    const lines = text.split(/\r?\n/);
    let indent = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) continue;

        // Decrease indent for closing symbols
        if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith('</') || trimmed.startsWith('</style>')) {
            indent = Math.max(0, indent - 1);
        }

        const newText = ' '.repeat(indent * 4) + trimmed;
        if (line !== newText) {
            edits.push({
                range: { start: { line: i, character: 0 }, end: { line: i, character: line.length } },
                newText
            });
        }

        // Increase indent for opening symbols
        if (trimmed.endsWith('{') || trimmed.endsWith('[') || (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('/>'))) {
            indent++;
        }
    }
    return edits;
});

/**
 * Semantic Tokens: Provides coloring for framework-specific identifiers.
 */
connection.languages.semanticTokens.on((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return { data: [] };

    const text = document.getText();
    const data: number[] = [];
    let lastLine = 0;
    let lastChar = 0;

    const tokens: { line: number, char: number, length: number, type: number, mod: number }[] = [];

    // 1. Signals: @name
    const signalRegex = /@([a-zA-Z0-9_]+)/g;
    let match;
    while ((match = signalRegex.exec(text)) !== null) {
        const pos = document.positionAt(match.index);
        tokens.push({ line: pos.line, char: pos.character, length: match[0].length, type: 1, mod: 0 }); // variable
    }

    // 2. Directives: c-if, c-for, animate:fade etc.
    const directiveRegex = /\b(c-[a-z-]+|animate:[a-z-]+)(?==|[\s>])/g;
    while ((match = directiveRegex.exec(text)) !== null) {
        const pos = document.positionAt(match.index);
        tokens.push({ line: pos.line, char: pos.character, length: match[0].length, type: 6, mod: 0 }); // macro
    }

    // 3. Components: <MyComponent
    const componentRegex = /<(\/?[A-Z][a-zA-Z0-9]*)/g;
    while ((match = componentRegex.exec(text)) !== null) {
        const isClosing = match[1].startsWith('/');
        const name = isClosing ? match[1].slice(1) : match[1];
        const startOffset = match.index + (isClosing ? 2 : 1);
        const pos = document.positionAt(startOffset);
        tokens.push({ line: pos.line, char: pos.character, length: name.length, type: 5, mod: 0 }); // class
    }

    // Sort tokens by line and character
    tokens.sort((a, b) => a.line !== b.line ? a.line - b.line : a.char - b.char);

    for (const token of tokens) {
        const deltaLine = token.line - lastLine;
        const deltaChar = deltaLine === 0 ? token.char - lastChar : token.char;

        data.push(deltaLine, deltaChar, token.length, token.type, token.mod);
        lastLine = token.line;
        lastChar = token.char;
    }

    return { data };
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
const validationDelays = new Map<string, NodeJS.Timeout>();

documents.onDidChangeContent(change => {
    const uri = change.document.uri;
    const existingDelay = validationDelays.get(uri);
    if (existingDelay) clearTimeout(existingDelay);

    validationDelays.set(uri, setTimeout(() => {
        validateTextDocument(change.document);
        validationDelays.delete(uri);
    }, 500));
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const text = textDocument.getText();
    const diagnostics: Diagnostic[] = [];

    try {
        // Use the real framework compiler to validate the document.
        // This will run the parser and all registered plugins (c-if, c-for, etc.)
        await transpile(text, defaultPlugins, textDocument.uri);
    } catch (e: any) {
        // Map compiler errors to LSP Diagnostics.
        // We attempt to extract line numbers if the compiler provides them in the error message.
        const message = e.message || 'Unknown syntax error';
        const lineMatch = message.match(/line (\d+)/i);
        const line = lineMatch ? parseInt(lineMatch[1]) - 1 : 0;

        diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: {
                start: { line, character: 0 },
                end: { line, character: Number.MAX_VALUE }
            },
            message: message,
            source: 'Can Compiler'
        });
    }

    // Send the computed diagnostics back to VS Code.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// Listen for document events
documents.listen(connection);
connection.listen();