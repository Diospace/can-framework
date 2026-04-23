const vscode = require('vscode');

function activate(context) {
    console.log('Can Framework Language Support is now active!');

    // Register a command (optional, but good for testing)
    let disposable = vscode.commands.registerCommand('can.showInfo', function () {
        vscode.window.showInformationMessage('Can Language Support is running!');
    });

    context.subscriptions.push(disposable);

    // Register a completion provider for .can files
    const provider = vscode.languages.registerCompletionItemProvider('can', {
        provideCompletionItems(document, position, token, context) {
            const completions = [];
            const text = document.getText();
            const offset = document.offsetAt(position);
            const prefix = text.slice(0, offset);

            // Context Detection
            // 1. CSS: Are we inside <style> ... </style>?
            const lastStyleOpen = prefix.lastIndexOf('<style');
            const lastStyleClose = prefix.lastIndexOf('</style>');
            const isCss = lastStyleOpen > -1 && lastStyleOpen > lastStyleClose;

            // 2. HTML: Are we inside var template = ` ... `?
            // We check if the last "var template = `" is followed by exactly one backtick (the opening one)
            const lastTemplateStart = prefix.lastIndexOf('var template = `');
            let isHtml = false;
            if (lastTemplateStart > -1) {
                const sub = prefix.slice(lastTemplateStart);
                const backticks = (sub.match(/`/g) || []).length;
                if (backticks === 1) isHtml = true;
            }

            if (isCss) {
                // CSS Properties
                const cssProps = ['color', 'background', 'background-color', 'margin', 'padding', 'border', 'font-size', 'display', 'flex', 'grid', 'width', 'height', 'position', 'top', 'left', 'right', 'bottom', 'z-index', 'opacity'];
                cssProps.forEach(prop => {
                    completions.push(new vscode.CompletionItem(prop, vscode.CompletionItemKind.Property));
                });
            } else if (isHtml) {
                // HTML Tags
                const htmlTags = ['div', 'span', 'p', 'a', 'img', 'ul', 'li', 'h1', 'h2', 'h3', 'button', 'input', 'form', 'label', 'section', 'header', 'footer'];
                htmlTags.forEach(tag => {
                    const item = new vscode.CompletionItem(tag, vscode.CompletionItemKind.Snippet);
                    item.insertText = new vscode.SnippetString(`${tag}>$0</${tag}>`);
                    completions.push(item);
                });
            } else {
                // JS Keywords & Can Specifics
                const jsKeywords = [
                    'component', 'var', 'import', 'from', 'return', 
                    'if', 'else', 'async', 'await', 'function', 'const', 'let', 
                    'console', 'window', 'document', 'Array', 'Object', 'JSON'
                ];

                jsKeywords.forEach(text => {
                    completions.push(new vscode.CompletionItem(text, vscode.CompletionItemKind.Keyword));
                });

                const templateItem = new vscode.CompletionItem('template', vscode.CompletionItemKind.Property);
                templateItem.documentation = new vscode.MarkdownString('Defines the HTML structure of the component.');
                templateItem.detail = 'var template = `...`';
                completions.push(templateItem);
            }

            return completions;
        }
    });

    context.subscriptions.push(provider);

    // Register a hover provider
    const hoverProvider = vscode.languages.registerHoverProvider('can', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

            if (word === 'component') {
                return new vscode.Hover(new vscode.MarkdownString('**Can Component**\n\nDefines a new UI component with encapsulated logic and styles.'));
            }
            if (word === 'signal') {
                return new vscode.Hover(new vscode.MarkdownString('**Reactive Signal**\n\nCreates a reactive value that updates the UI when changed.'));
            }
            if (word === 'template') {
                return new vscode.Hover(new vscode.MarkdownString('**Component Template**\n\nDefines the HTML structure for the component.'));
            }
        }
    });

    context.subscriptions.push(hoverProvider);

    // Register a formatting provider
    const formatProvider = vscode.languages.registerDocumentFormattingEditProvider('can', {
        provideDocumentFormattingEdits(document) {
            const edits = [];
            let indent = 0;

            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                const text = line.text.trim();

                if (!text) continue;

                // Decrease indent for closing brackets/tags
                if (text.startsWith('}') || text.startsWith(']') || text.startsWith('</')) {
                    indent = Math.max(0, indent - 1);
                }

                const newText = ' '.repeat(indent * 4) + text;
                if (line.text !== newText) {
                    edits.push(vscode.TextEdit.replace(line.range, newText));
                }

                // Increase indent for opening brackets/tags
                if (text.endsWith('{') || text.endsWith('[') || (text.startsWith('<') && !text.startsWith('</') && !text.includes('/>'))) {
                    indent++;
                }
            }
            return edits;
        }
    });

    context.subscriptions.push(formatProvider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
