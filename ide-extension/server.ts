import * as path from 'path';
import * as fs from 'fs';
import {
    createConnection,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity,
    ProposedFeatures,
    InitializeParams,
    TextDocumentSyncKind,
    InitializeResult,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    TextEdit,
    DocumentFormattingParams,
    Definition,
    Location
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
            // Tell the client that this server supports "Go to Definition"
            definitionProvider: true
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
    const wordMatch = text.slice(0, offset).match(/([@a-zA-Z0-9_]+)$/);
    const wordRest = text.slice(offset).match(/^([a-zA-Z0-9_]+)/);
    let word = (wordMatch ? wordMatch[0] : '') + (wordRest ? wordRest[0] : '');
    if (word.startsWith('@')) word = word.slice(1);

    const docs: Record<string, string> = {
        'component': '**Can Component**\n\nDefines a new UI component with encapsulated logic and styles.',
        'signal': '**Reactive Signal**\n\nCreates a reactive value that updates the UI when changed.',
        'template': '**Component Template**\n\nDefines the HTML structure for the component.',
        'computed': '**Derived State**\n\nCreates a read-only reactive value that updates when its dependencies change.',
        'effect': '**Side Effect**\n\nRuns a function and automatically re-runs it when reactive dependencies change.'
    };

    if (docs[word]) {
        return {
            contents: {
                kind: 'markdown',
                value: docs[word]
            }
        };
    }

    return null;
});

/**
 * Completion Logic: Provides intelligent suggestions based on context.
 */
connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return [];

    const text = document.getText();
    const offset = document.offsetAt(params.position);
    const prefix = text.slice(0, offset);

    // 1. CSS Context
    const lastStyleOpen = prefix.lastIndexOf('<style');
    const lastStyleClose = prefix.lastIndexOf('</style>');
    if (lastStyleOpen > -1 && lastStyleOpen > lastStyleClose) {
        const cssProps = ['color', 'background', 'margin', 'padding', 'display', 'flex', 'opacity'];
        return cssProps.map(prop => ({ label: prop, kind: CompletionItemKind.Property }));
    }

    // 2. HTML Template Context
    const lastTemplateStart = prefix.lastIndexOf('template = `');
    if (lastTemplateStart > -1) {
        const sub = prefix.slice(lastTemplateStart);
        const backticks = (sub.match(/`/g) || []).length;
        if (backticks === 1) {
            const htmlTags = ['div', 'span', 'p', 'button', 'input', 'h1', 'h2'];
            return htmlTags.map(tag => ({
                label: tag,
                kind: CompletionItemKind.Snippet,
                insertText: `${tag}>$0</${tag}>`,
                insertTextFormat: 2 // Snippet
            }));
        }
    }

    // 3. General Framework Keywords
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
            insertTextFormat: 2
        },
        { label: 'component', kind: CompletionItemKind.Keyword },
        { label: 'signal', kind: CompletionItemKind.Function },
        { label: 'computed', kind: CompletionItemKind.Function },
        { label: 'effect', kind: CompletionItemKind.Function }
    ];
});

// This handler resolves additional information for the item selected in the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
    return item;
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
    const wordMatchAtPos = line.slice(0, params.position.character).match(/[a-zA-Z0-9-]+$/);
    const wordRestAtPos = line.slice(params.position.character).match(/^[a-zA-Z0-9-]+/);
    const word = (wordMatchAtPos ? wordMatchAtPos[0] : '') + (wordRestAtPos ? wordRestAtPos[0] : '');

    // 1. Resolve relative imports: import { ... } from './MyComponent'
    const importMatch = line.match(/from\s+['"](\..+?)['"]/);
    if (importMatch) {
        const targetPathRaw = importMatch[1];
        const targetPath = targetPathRaw.endsWith('.can') ? targetPathRaw : `${targetPathRaw}.can`;
        const fullPath = path.resolve(path.dirname(fileURLToPath(params.textDocument.uri)), targetPath);

        if (fs.existsSync(fullPath)) {
            return Location.create(pathToFileURL(fullPath).toString(), { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } });
        }
    }

    // 2. Resolve Component Tags or Class Names
    if (word) {
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
        if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith('</')) {
            indent = Math.max(0, indent - 1);
        }

        const newText = ' '.repeat(indent * 4) + trimmed;
        if (line !== newText) {
            edits.push({
                range: {
                    start: { line: i, character: 0 },
                    end: { line: i, character: line.length }
                },
                newText: newText
            });
        }

        // Increase indent for opening symbols
        if (trimmed.endsWith('{') || trimmed.endsWith('[') || (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.includes('/>'))) {
            indent++;
        }
    }
    return edits;
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