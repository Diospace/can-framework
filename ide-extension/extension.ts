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
 * This method is called when the extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Can Framework Language Support is now active!');

    // The server is implemented in node
    const serverModule = context.asAbsolutePath(path.join('out', 'server.js'));

    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc }
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
            vscode.window.showInformationMessage('Can Framework Support is active with LSP enabled.');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('can.restartServer', async () => {
            if (client) {
                await client.stop();
                await client.start();
                vscode.window.showInformationMessage('Can Language Server restarted.');
            }
        })
    );
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
