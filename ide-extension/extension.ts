import * as vscode from 'vscode';
import * as path from 'path';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

/**
 * HTML Void elements that do not require a closing tag.
 */
const VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

/**
 * This method is called when the extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Can Framework Language Support is now active!');

    // The server is implemented in node
    const serverModule = context.asAbsolutePath(path.join('out', 'server.js'));

    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { 
            module: serverModule, 
            transport: TransportKind.ipc,
            options: { execArgv: ['--nolazy', '--inspect=6009'] }
        }
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'can' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.can')
        }
    };

    client = new LanguageClient(
        'canLanguageServer',
        'Can Language Server',
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    client.start().then(() => {
        console.log('Can Language Server is ready.');
    }).catch(err => {
        console.error('Failed to start Can Language Server:', err);
    });

    // Register additional commands defined in package.json
    context.subscriptions.push(
        vscode.commands.registerCommand('can.showInfo', () => {
            vscode.window.showInformationMessage('Can Language Support is active with LSP enabled.');
        })
    );

    const restartCommand = vscode.commands.registerCommand('can.restartServer', async () => {
        if (client) {
            await client.stop();
            await client.start();
            vscode.window.showInformationMessage('Can Language Server restarted.');
        }
    });

    context.subscriptions.push(restartCommand);

    // --- 3. AUTO-CLOSE TAG LOGIC ---
    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !client || event.document.languageId !== 'can' || event.contentChanges.length !== 1) {
            return;
        }

        const change = event.contentChanges[0];
        // Only trigger when the user types '>'
        if (change.text !== '>') {
            return;
        }

        const position = change.range.start.translate(0, 1);
        const lineText = editor.document.lineAt(position.line).text;
        const textBefore = lineText.substring(0, position.character);
        const textAfter = lineText.substring(position.character);

        // Regex to find the opening tag name just before the cursor, ensuring it's not a self-closing tag
        const tagMatch = textBefore.match(/<([a-zA-Z][a-zA-Z0-9-]*)(?:\s+[^>]*?)?>$/);
        if (!tagMatch || textBefore.endsWith('/>') || textAfter.trim().startsWith(`</${tagMatch[1]}>`)) {
            return;
        }

        const tagName = tagMatch[1];

        // Don't close void elements (e.g., <img >)
        if (VOID_ELEMENTS.includes(tagName.toLowerCase())) {
            return;
        }

        // Ensure we are inside a template block
        const offset = editor.document.offsetAt(position);
        // Scan only the last 5000 characters to prevent performance degradation on large files
        const startScan = Math.max(0, offset - 5000);
        const prefix = editor.document.getText(new vscode.Range(editor.document.positionAt(startScan), position));
        
        if (!/(?:var|let|const)?\s*template\s*[:=]\s*`[^`]*$/.test(prefix)) {
            return;
        }

        // Insert the closing tag
        editor.edit(editBuilder => {
            editBuilder.insert(position, `</${tagName}>`);
        }, { undoStopBefore: false, undoStopAfter: false }).then(() => {
            // Keep the cursor after the '>'
            editor.selection = new vscode.Selection(position, position);
        });
    });
}

/**
 * Clean up the language client on extension deactivation.
 */
export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
