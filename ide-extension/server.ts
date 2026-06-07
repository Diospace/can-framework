import * as path from 'path';
import * as fs from 'fs';
import * as prettier from 'prettier';
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettierPluginHtml from "prettier/plugins/html";
import * as prettierPluginPostcss from "prettier/plugins/postcss";
import {
    createConnection,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity,
    DocumentHighlight,
    DocumentHighlightKind,
    FoldingRange,
    FoldingRangeKind,
    ProposedFeatures,
    InitializeParams,
    TextDocumentSyncKind,
    InitializeResult,
    DocumentSymbolParams,
    DocumentSymbol,
    SymbolKind,
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
    InlayHint,
    InlayHintKind,
    CompletionList,
    SemanticTokensBuilder,
    CodeAction,
    CodeActionKind,
    CodeActionParams
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { fileURLToPath, pathToFileURL } from 'url';

import { transpile } from '../src/compiler/codegen';
import { cMountPlugin } from '../src/compiler/directives/c-mount-plugin';
import { onUpdatePlugin } from '../src/compiler/directives/on-update';
import { cIfPlugin } from '../src/compiler/directives/c-if';
import { cForPlugin } from '../src/compiler/directives/c-for';
import { cBindPlugin } from '../src/compiler/directives/c-bind';
import { cModelPlugin } from '../src/compiler/directives/c-model';
import { cShowPlugin } from '../src/compiler/directives/c-show';

// Create a connection for the server, using Node's IPC as a transport.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

const defaultPlugins = [
    cMountPlugin,
    onUpdatePlugin,
    cIfPlugin,
    cForPlugin,
    cBindPlugin,
    cModelPlugin,
    cShowPlugin
];

/**
 * Safely converts a file URI to a machine-local file path.
 */
function getPathFromUri(uri: string): string {
    try {
        return fileURLToPath(uri);
    } catch (e) {
        // Manual fallback for environments where fileURLToPath fails
        let sourcePath = uri.replace(/^file:\/\/\/?/, '');
        if (process.platform === 'win32' && !/^[a-zA-Z]:/.test(sourcePath)) {
            sourcePath = sourcePath.replace(/^\//, '');
        }
        return sourcePath;
        //return uri.startsWith('file://') ? fileURLToPath(uri) : uri;
    }
}

/**
 * Semantic Token Legend definition.
 * Centrally defined to ensure indices match between connection.onInitialize and the token collector.
 */
const tokenLegend = {
    types: ['keyword', 'variable', 'function', 'parameter', 'property', 'class', 'macro'],
    modifiers: ['declaration', 'readonly', 'reactive']
};

const tokenTypeIndex = Object.fromEntries(
    tokenLegend.types.map((t, i) => [t, i])
) as Record<string, number>;

const tokenModifierIndex = Object.fromEntries(
    tokenLegend.modifiers.map((m, i) => [m, i])
) as Record<string, number>;

const Mod = {
    declaration: 1 << tokenModifierIndex.declaration,
    readonly: 1 << tokenModifierIndex.readonly,
    reactive: 1 << tokenModifierIndex.reactive
};

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
            // Tell the client that this server supports "Quick Fixes"
            codeActionProvider: true,
            // Tell the client that this server supports highlighting matching symbols
            documentHighlightProvider: true,
            // Tell the client that this server supports "Go to Definition"
            definitionProvider: true,
            // Support Outline view and Breadcrumbs
            documentSymbolProvider: true,
            linkedEditingRangeProvider: true,
            semanticTokensProvider: {
                legend: {
                    tokenTypes: tokenLegend.types,
                    tokenModifiers: tokenLegend.modifiers
                },
                full: true
            },
            // Support for collapsing blocks
            foldingRangeProvider: true,
            // Support for inline reactive type labels
            inlayHintProvider: true
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
    const wordMatch = text.slice(0, offset).match(/([@$a-zA-Z0-9_.-]+)$/);
    const wordRest = text.slice(offset).match(/^([$a-zA-Z0-9_.-]+)/);
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
        'props': '**Component Props**\n\nAccess the reactive attributes passed to the component. In `<script>`, use `props.count`. In templates, you can use them directly.',
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
 * Extracts all declared variables and functions from a script.
 */
function getScriptDeclarations(text: string): Set<string> {
    const declarations = new Set<string>();
    // Standard var/let/const/function
    const declRegex = /\b(?:var|let|const|function)\s+([a-zA-Z0-9_$]+)/g;
    let match;
    while ((match = declRegex.exec(text)) !== null) {
        if (match[1]) declarations.add(match[1]);
    }
    // Destructuring
    const destructRegex = /(?:var|let|const)\s*\{\s*([^}]+)\s*\}\s*=/g;
    while ((match = destructRegex.exec(text)) !== null) {
        match[1].split(',').forEach(v => {
            const name = v.split(':')[0].trim();
            if (name) declarations.add(name);
        });
    }
    return declarations;
}

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

        // 2.0.1 Suggest Script Variables inside Interpolation {{ | }}
        const interpMatch = prefix.match(/\{\{\s*([a-zA-Z0-9_$]*)$/);
        if (interpMatch) {
            const scriptVars = getScriptDeclarations(text);
            return Array.from(scriptVars).map(v => ({
                label: v,
                kind: CompletionItemKind.Variable,
                detail: 'Component Signal/Variable'
            }));
        }

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
        {
            label: 'import',
            kind: CompletionItemKind.Keyword,
            detail: 'Import a module dependency',
            insertText: "import { ${1:Member} } from '${2:./module}';",
            insertTextFormat: InsertTextFormat.Snippet
        },
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
 * Document Symbols: Populates the Outline view and Breadcrumbs.
 */
connection.onDocumentSymbol((params: DocumentSymbolParams): DocumentSymbol[] => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const lines = text.split(/\r?\n/);
    const symbols: DocumentSymbol[] = [];

    // 1. Component Name
    const componentMatch = text.match(/component\s+([A-Za-z0-9_]+)/);
    if (componentMatch) {
        const name = componentMatch[1];
        const range = Range.create(document.positionAt(componentMatch.index!), document.positionAt(componentMatch.index! + componentMatch[0].length));
        symbols.push(DocumentSymbol.create(name, 'Can Component', SymbolKind.Class, range, range));
    }

    // 2. Signals and Variables
    const varRegex = /\b(?:var|let|const)\s+([a-zA-Z0-9_$]+)\s*=/g;
    let match;
    while ((match = varRegex.exec(text)) !== null) {
        const name = match[1];
        const pos = document.positionAt(match.index);
        const range = Range.create(pos, document.positionAt(match.index + match[0].length));

        const lineText = lines[pos.line] || '';
        const kind = (lineText.includes('signal(') || lineText.includes('computed(')) ? SymbolKind.Variable : SymbolKind.Field;
        symbols.push(DocumentSymbol.create(name, '', kind, range, range));
    }

    // 3. Functions
    const funcRegex = /\bfunction\s+([a-zA-Z0-9_$]+)/g;
    while ((match = funcRegex.exec(text)) !== null) {
        const name = match[1];
        const range = Range.create(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
        symbols.push(DocumentSymbol.create(name, '', SymbolKind.Function, range, range));
    }

    // 4. Template Block
    const templateRegex = /template\s*[:=]\s*`/g;
    match = templateRegex.exec(text);
    if (match) {
        const range = Range.create(document.positionAt(match.index), document.positionAt(match.index + 8));
        symbols.push(DocumentSymbol.create('template', 'UI Structure', SymbolKind.Module, range, range));
    }

    return symbols;
});

/**
 * Folding Ranges: Allows collapsing <style> and template blocks.
 */
connection.onFoldingRanges((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const ranges: FoldingRange[] = [];

    // 1. Fold <style> blocks
    const styleRegex = /<style[\s\S]*?>([\s\S]*?)<\/style>/g;
    let match;
    while ((match = styleRegex.exec(text)) !== null) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        if (startPos.line < endPos.line) {
            ranges.push({
                startLine: startPos.line,
                endLine: endPos.line,
                kind: FoldingRangeKind.Region
            });
        }
    }

    // 2. Fold template assignments
    const templateRegex = /template\s*[:=]\s*`([\s\S]*?)`/g;
    while ((match = templateRegex.exec(text)) !== null) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        if (startPos.line < endPos.line) {
            ranges.push({
                startLine: startPos.line,
                endLine: endPos.line,
                kind: FoldingRangeKind.Region
            });
        }
    }

    return ranges;
});

/**
 * Inlay Hints: Provides reactive labels for signals and computed values.
 */
connection.languages.inlayHint.on((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const hints: InlayHint[] = [];

    // Find signal declarations: var x = signal(...)
    const signalRegex = /\b(?:var|let|const)\s+([a-zA-Z0-9_$]+)\s*=\s*signal\(/g;
    let match;
    while ((match = signalRegex.exec(text)) !== null) {
        const nameEndOffset = match.index + match[0].indexOf(match[1]) + match[1].length;
        hints.push({
            position: document.positionAt(nameEndOffset),
            label: ': Signal',
            kind: InlayHintKind.Type,
            paddingLeft: true
        });
    }

    // Find computed declarations: var x = computed(...)
    const computedRegex = /\b(?:var|let|const)\s+([a-zA-Z0-9_$]+)\s*=\s*computed\(/g;
    while ((match = computedRegex.exec(text)) !== null) {
        const nameEndOffset = match.index + match[0].indexOf(match[1]) + match[1].length;
        hints.push({
            position: document.positionAt(nameEndOffset),
            label: ': Computed',
            kind: InlayHintKind.Type,
            paddingLeft: true
        });
    }

    return hints;
});

/**
 * Shared logic to find a tag at the current position and its matching pair.
 */
function findMatchingTagPair(document: TextDocument, position: any) {
    const text = document.getText();
    const offset = document.offsetAt(position);
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
    const tagName = (isClosing ? (closeMatch ? closeMatch[1] : '') : (openMatch ? openMatch[1] : '')) + (restMatch ? restMatch[0] : "");
    if (!tagName) return null;

    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    if (voidElements.includes(tagName.toLowerCase())) return null;

    const ranges: Range[] = [{
        start: document.positionAt(nameStartOffset),
        end: document.positionAt(nameStartOffset + tagName.length)
    }];

    if (isClosing) {
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
    return ranges.length === 2 ? ranges : null;
}

/**
 * Linked Editing: Supports auto-renaming of HTML tags.
 */
connection.languages.onLinkedEditingRange((params: LinkedEditingRangeParams): LinkedEditingRanges | null => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;
    const ranges = findMatchingTagPair(document, params.position);
    return ranges ? { ranges } : null;
});

/**
 * Document Highlight: Highlights matching opening and closing tags.
 */
connection.onDocumentHighlight((params: TextDocumentPositionParams): DocumentHighlight[] | null => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;
    const ranges = findMatchingTagPair(document, params.position);
    return ranges ? ranges.map(range => ({ range, kind: DocumentHighlightKind.Text })) : null;
});

/**
 * Definition Logic: Resolve component paths and imports.
 */
connection.onDefinition((params: TextDocumentPositionParams): Location | Location[] | null => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;

    const text = document.getText();
    const position = params.position;
    const lines = text.split(/\r?\n/);
    const currentLine = lines[position.line];

    // 1. Resolve relative imports (Robust Logic)
    const importRegex = /from\s+['"]([^'"]+)['"]/;
    const match = currentLine.match(importRegex);

    if (match && match[1]) {
        const importTarget = match[1];

        const sourcePath = getPathFromUri(document.uri);
        const currentDir = path.dirname(sourcePath);
        let targetAbsolutePath = path.resolve(currentDir, importTarget);

        // Standard sequence for deducing extensions if left implicit in code
        const lookupExtensions = ['', '.ts', '.can', '.tsx', '.js', '.jsx'];
        let workingFile = '';

        for (const ext of lookupExtensions) {
            const pathWithExt = targetAbsolutePath + ext;
            if (fs.existsSync(pathWithExt) && fs.statSync(pathWithExt).isFile()) {
                workingFile = pathWithExt;
                break;
            }
        }

        // DEEP FOLDER LOOKUP: If no extension matched, check if it's a folder containing files
        if (!workingFile && fs.existsSync(targetAbsolutePath)) {
            const isDir = fs.statSync(targetAbsolutePath).isDirectory();
            if (isDir) {
                const innerExtensions = ['.ts', '.can', '.js', '.tsx'];
                for (const ext of innerExtensions) {
                    const indexPath = path.join(targetAbsolutePath, `index${ext}`);
                    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
                        workingFile = indexPath;
                        break;
                    }
                }
            }
        }

        if (!workingFile) {
            for (const ext of ['.ts', '/index.ts', '.can', '/index.can', '.js', '/index.js']) {
                const guessingPath = targetAbsolutePath + ext;
                if (fs.existsSync(guessingPath) && fs.statSync(guessingPath).isFile()) {
                    workingFile = guessingPath;
                    break;
                }
            }
        }

        if (workingFile) {
            const destinationUri = pathToFileURL(workingFile).toString();
            return Location.create(destinationUri, { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } });
        }
    }

    // 2. Resolve Definitions (Internal Signals/Methods or Components)
    const offset = document.offsetAt(params.position);
    const wordMatchAtPos = currentLine.slice(0, position.character).match(/[@$a-zA-Z0-9_.-]+$/);
    const wordRestAtPos = currentLine.slice(position.character).match(/^[$a-zA-Z0-9_.-]+/);
    const word = (wordMatchAtPos ? wordMatchAtPos[0] : '') + (wordRestAtPos ? wordRestAtPos[0] : '');

    if (word) {
        const cleanWord = word.startsWith('@') ? word.slice(1) : word;
        const declarationRegex = new RegExp(`(?:\\b(?:var|let|const|function)\\s+|\\b)${cleanWord}\\b(?=\\s*[=(]|$)`, 'g');
        let declMatch;
        while ((declMatch = declarationRegex.exec(text)) !== null) {
            if (declMatch.index <= offset && offset <= declMatch.index + declMatch[0].length) continue;
            return Location.create(document.uri, {
                start: document.positionAt(declMatch.index),
                end: document.positionAt(declMatch.index + declMatch[0].length)
            });
        }

        const componentName = word.includes('-')
            ? word.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
            : word;

        const sourcePath = getPathFromUri(document.uri);
        const dir = path.dirname(sourcePath);
        for (const ext of ['.can', '.ts', '.js']) {
            const possibleFile = path.join(dir, `${componentName}${ext}`);
            if (fs.existsSync(possibleFile)) {
                return Location.create(pathToFileURL(possibleFile).toString(), { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } });
            }
        }
    }

    return null;
});

/**
 * Code Action Logic: Provides Quick Fixes for template variable warnings.
 */
connection.onCodeAction((params: CodeActionParams): CodeAction[] => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return [];

    const codeActions: CodeAction[] = [];
    for (const diagnostic of params.context.diagnostics) {
        // Filter for our specific undeclared variable warning
        if (diagnostic.source === 'Can Language Server' && diagnostic.message.includes('not declared')) {
            const varMatch = diagnostic.message.match(/"([^"]+)"/);
            if (!varMatch) continue;

            const varName = varMatch[1];
            const text = document.getText();

            // Find a suitable place to insert the new variable declaration.
            // We look for the start of the component block.
            const componentMatch = text.match(/component\s+[A-Za-z0-9_]+\s*\{/);
            if (componentMatch) {
                const insertOffset = componentMatch.index! + componentMatch[0].length;
                const insertPos = document.positionAt(insertOffset);

                codeActions.push({
                    title: `Declare signal "${varName}" in script`,
                    kind: CodeActionKind.QuickFix,
                    diagnostics: [diagnostic],
                    isPreferred: true,
                    edit: {
                        changes: {
                            [params.textDocument.uri]: [{
                                range: Range.create(insertPos, insertPos),
                                newText: `\n    var ${varName} = signal(null);`
                            }]
                        }
                    }
                });
            }
        }
    }
    return codeActions;
});

/**
 * Document Formatting Logic: Automatically triggers on Alt+Shift+F or on Save.
 */
connection.onDocumentFormatting(async (params: DocumentFormattingParams): Promise<TextEdit[]> => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return [];

    const rawText = document.getText();

    try {
        const formattedText = await prettier.format(rawText, {
            parser: 'babel-ts',
            plugins: [prettierPluginBabel, prettierPluginEstree, prettierPluginHtml, prettierPluginPostcss],
            tabWidth: params.options.tabSize,
            useTabs: !params.options.insertSpaces,
            semi: true,
            singleQuote: true,
            printWidth: 100,
            trailingComma: 'none'
        });

        const fullRange = Range.create(
            document.positionAt(0),
            document.positionAt(rawText.length)
        );

        return [TextEdit.replace(fullRange, formattedText)];
    } catch (error: any) {
        connection.console.error(`Can Formatter Framework Error: ${error.message}`);
        return [];
    }
});

/**
 * Semantic Tokens: Provides coloring for framework-specific identifiers.
 */
connection.languages.semanticTokens.on((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return { data: [] };

    const text = document.getText();
    const builder = new SemanticTokensBuilder();
    const tokens: { line: number, char: number, length: number, type: number, mod: number, offset: number }[] = [];

    // Metadata map to track variables/functions for usage highlighting
    const nameToTokenInfo = new Map<string, { type: number, mod: number }>();

    // Pre-seed common framework identifiers
    nameToTokenInfo.set('this', { type: tokenTypeIndex.keyword, mod: 0 });
    nameToTokenInfo.set('props', { type: tokenTypeIndex.variable, mod: Mod.reactive });
    ['signal', 'computed', 'effect', 'onMount', 'onUnmounted', 'onUpdated'].forEach(fn => {
        nameToTokenInfo.set(fn, { type: tokenTypeIndex.function, mod: Mod.reactive });
    });

    // 1. Pass: Declarations (Component name, var, let, const, function)
    const componentRegex = /\bcomponent\s+([A-Za-z0-9_]+)/g;
    let match;
    while ((match = componentRegex.exec(text)) !== null) {
        const name = match[1];
        const nameOffset = match.index + match[0].indexOf(name);
        const pos = document.positionAt(nameOffset);
        tokens.push({ line: pos.line, char: pos.character, length: name.length, type: tokenTypeIndex.class, mod: Mod.declaration, offset: nameOffset });
        nameToTokenInfo.set(name, { type: tokenTypeIndex.class, mod: 0 });
    }

    const declRegex = /\b(var|let|const|function)\s+([a-zA-Z0-9_$]+)\b/g;
    while ((match = declRegex.exec(text)) !== null) {
        const kind = match[1];
        const name = match[2];
        const nameOffset = match.index + match[0].indexOf(name);
        const pos = document.positionAt(nameOffset);

        let type = kind === 'function' ? tokenTypeIndex.function : tokenTypeIndex.variable;
        let mod = Mod.declaration;
        if (kind === 'const') mod |= Mod.readonly;

        // Lookahead to check if this is a reactive signal/computed assignment
        const rest = text.slice(match.index + match[0].length, match.index + match[0].length + 50);
        if (/\s*=\s*(signal|computed)\(/.test(rest)) {
            mod |= Mod.reactive;
        }

        tokens.push({ line: pos.line, char: pos.character, length: name.length, type, mod, offset: nameOffset });
        // Track for usages (stripping the declaration bit)
        nameToTokenInfo.set(name, { type, mod: mod & ~Mod.declaration });
    }

    // 2. Pass: Tracked Name Usages (consistent coloring for signals/props/etc)
    const usageRegex = /\b([a-zA-Z0-9_$]+)\b/g;
    while ((match = usageRegex.exec(text)) !== null) {
        const word = match[1];
        const info = nameToTokenInfo.get(word);
        if (info && !['var', 'let', 'const', 'function', 'component'].includes(word)) {
            const pos = document.positionAt(match.index);
            tokens.push({ line: pos.line, char: pos.character, length: word.length, type: info.type, mod: info.mod, offset: match.index });
        }
    }

    // 3. Pass: Signals and Event Shorthands (@name)
    const signalRegex = /(?:\s|^|["'>(])@([a-zA-Z0-9_$]+)\b/g;
    while ((match = signalRegex.exec(text)) !== null) {
        const startOffset = match.index + (match[0].indexOf('@'));
        const pos = document.positionAt(startOffset);
        tokens.push({ line: pos.line, char: pos.character, length: match[1].length + 1, type: tokenTypeIndex.variable, mod: Mod.reactive, offset: startOffset });
    }

    // 4. Pass: Directives (c-if, animate:fade, etc)
    const directiveRegex = /(?:\s|^|["'>(])(c-[a-zA-Z0-9_-]+|animate:[a-zA-Z0-9_-]+|:[a-zA-Z0-9_-]+)(?=[.=: \/>])/g;
    while ((match = directiveRegex.exec(text)) !== null) {
        const startOffset = match.index + match[0].indexOf(match[1]);
        const pos = document.positionAt(startOffset);
        tokens.push({ line: pos.line, char: pos.character, length: match[1].length, type: tokenTypeIndex.macro, mod: 0, offset: startOffset });
    }

    // 5. Pass: Property Access (.value, .item)
    const propertyRegex = /(?<=\.)[a-zA-Z_$][a-zA-Z0-9_$]*\b(?![-])/g;
    while ((match = propertyRegex.exec(text)) !== null) {
        const pos = document.positionAt(match.index);
        tokens.push({ line: pos.line, char: pos.character, length: match[0].length, type: tokenTypeIndex.property, mod: 0, offset: match.index });
    }

    // Sort by offset, then by length (longest first) to ensure outer tokens win over partial inner matches
    tokens.sort((a, b) => {
        if (a.offset !== b.offset) {
            return a.offset - b.offset;
        }
        return b.length - a.length;
    });

    // Filter out overlapping tokens to prevent partial word coloring
    const filteredTokens = [];
    let lastEndOffset = -1;
    for (const t of tokens) {
        // Ensure this token starts after the previous one ends
        if (t.offset >= lastEndOffset) {
            filteredTokens.push(t);
            lastEndOffset = t.offset + t.length;
        }
    }

    // Re-sort by line/char for delta builder
    filteredTokens.sort((a, b) => a.line !== b.line ? a.line - b.line : a.char - b.char);

    let lastLine = 0;
    let lastChar = 0;
    for (const t of filteredTokens) {
        const deltaLine = t.line - lastLine;
        const deltaChar = deltaLine === 0 ? t.char - lastChar : t.char;
        builder.push(deltaLine, deltaChar, t.length, t.type, t.mod);
        lastLine = t.line;
        lastChar = t.char;
    }

    return builder.build();
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

// Clear diagnostics when a file is closed
documents.onDidClose(change => {
    connection.sendDiagnostics({ uri: change.document.uri, diagnostics: [] });
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const text = textDocument.getText();
    const diagnostics: Diagnostic[] = [];

    // 1. COMPILER VALIDATION (Syntax & Directives)
    // This runs the full transpiler to catch parsing errors and directive misconfigurations.
    // We use a try/catch because the compiler throws on first fatal error.
    let compilerErrorLine = -1;

    try {
        // Use the real framework compiler to validate the document.
        // This will run the parser and all registered plugins (c-if, c-for, etc.)
        await transpile(text, defaultPlugins, textDocument.uri);
    } catch (e: any) {
        // Map compiler errors to LSP Diagnostics.
        // We attempt to extract line numbers if the compiler provides them in the error message.
        const message = e.message || 'Unknown syntax error';
        const lineMatch = message.match(/line (\d+)/i);
        compilerErrorLine = lineMatch ? parseInt(lineMatch[1]) - 1 : 0;

        diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: {
                start: { line: compilerErrorLine, character: 0 },
                end: { line: compilerErrorLine, character: Number.MAX_VALUE }
            },
            message: message,
            source: 'Can Compiler'
        });
    }

    // 2. VARIABLE USAGE VALIDATION (Template vs Script)
    // Only run if we don't have a fatal compiler error on the same line to avoid noise.
    const declaredVariables = new Set<string>([
        'this', 'props', 'Math', 'JSON', 'console', 'window', 'document', 'history', 'location',
        'onMount', 'onUnmounted', 'onUpdated', 'onCleanup', 'signal', 'computed', 'effect',
        'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
        'parseInt', 'parseFloat', 'encodeURIComponent', 'decodeURIComponent',
        'Object', 'Array', 'String', 'Number', 'Boolean', 'Promise', 'Map', 'Set',
        'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'await', 'async'
    ]);

    const scriptVars = getScriptDeclarations(text);
    scriptVars.forEach(v => declaredVariables.add(v));

    // SCAN TEMPLATES
    const templateRegex = /(?:var|this\.|let|const)?\s*template\s*[:=]\s*`([\s\S]*?)`/g;
    let templateMatch;
    while ((templateMatch = templateRegex.exec(text)) !== null) {
        const templateContent = templateMatch[1];
        const templateStartOffset = templateMatch.index + text.indexOf('`', templateMatch.index) - templateMatch.index + 1;

        // A. Interpolations {{ expr }}
        const interpolationRegex = /\{\{\s*([\s\S]*?)\s*\}\}/g;
        let interpMatch;
        while ((interpMatch = interpolationRegex.exec(templateContent)) !== null) {
            const expression = interpMatch[1];
            const matchOffset = templateStartOffset + interpMatch.index + (interpMatch[0].indexOf(expression));
            analyzeExpression(expression, matchOffset, declaredVariables, textDocument, diagnostics);
        }

        // B. Structural Directives (c-if, c-show, etc.)
        const directiveRegex = /\b(c-if|c-show|c-else-if)=["']([^"']+)["']/g;
        let dirMatch;
        while ((dirMatch = directiveRegex.exec(templateContent)) !== null) {
            const expression = dirMatch[2];
            const matchOffset = templateStartOffset + dirMatch.index + dirMatch[0].indexOf(expression);
            analyzeExpression(expression, matchOffset, declaredVariables, textDocument, diagnostics);
        }
    }

    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

/**
 * Isolated Expression Tokenizer: Identifies used variables and throws diagnostics if undeclared.
 */
function analyzeExpression(
    expression: string,
    baseOffset: number,
    declaredVariables: Set<string>,
    document: TextDocument,
    diagnostics: Diagnostic[]
) {
    const wordsRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
    let wordMatch;

    while ((wordMatch = wordsRegex.exec(expression)) !== null) {
        const word = wordMatch[0];
        const wordIndex = wordMatch.index;

        // 1. Ignore object properties (ignore 'value' in 'count.value')
        const charBeforeWord = expression.charAt(wordIndex - 1);
        if (charBeforeWord === '.') continue;

        // 2. Ignore numeric literals and JS keywords handled by the lexer
        if (!isNaN(Number(word))) continue;

        if (!declaredVariables.has(word)) {
            const startPosition = document.positionAt(baseOffset + wordIndex);
            const endPosition = document.positionAt(baseOffset + wordIndex + word.length);

            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: Range.create(startPosition, endPosition),
                message: `Can Ecosystem Alert: The variable "${word}" is used in the template but is not declared in the component script.`,
                source: 'Can Language Server'
            });
        }
    }
}

// Listen for document events
documents.listen(connection);
connection.listen();