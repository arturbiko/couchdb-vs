import * as vscode from 'vscode';
import { Database } from '../services/Database';

export default class SidebarProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'couchdbVS-sidebar';

	private _view?: vscode.WebviewView;

	private _context: vscode.ExtensionContext;

	private database: Database;

	constructor(
		private readonly context: vscode.ExtensionContext,
		private readonly _extensionUri: vscode.Uri,
	) {
		this._context = context;
		this.database = new Database();
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(async (data) => {
			switch (data.type) {
				case 'CONNECT':
					try {
						await webviewView.webview.postMessage({
							type: 'LOADING',
							payload: {
								started: true
							}
						});

						const info = await this.database.up(data);

						this.database.auth(data, 
							async (cookie: string) => {
								this._context.workspaceState.update('couchdb-vs-nano-cookie', cookie);
								this._context.workspaceState.update('couchdb-vs-nano-meta', info);

								await webviewView.webview.postMessage({
									type: 'CONNECT',
									payload: {
										connected: true,
										info: info
									}
								});
		
								await webviewView.webview.postMessage({
									type: 'LOADING',
									payload: {
										started: false
									}
								});
		
								vscode.window.showInformationMessage("Successfully connected to CouchDB!");	
							}, 
							async (error: string) => {
								await webviewView.webview.postMessage({
									type: 'LOADING',
									payload: {
										started: false
									}
								});

								vscode.window.showErrorMessage(error);	
							}
						);
					} catch (error: any) {
						vscode.window.showErrorMessage(error);	
					}

					break;
				default:
					break;
			}
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const bundleScriptPath = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'app', 'extension.js'));
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		const styleView = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'assets', 'SidebarProvider.css'));

		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleView}" rel="stylesheet">
			</head>
			<body>
				<div id="root" data-id="${SidebarProvider.viewType}"></div>
				<script src="${bundleScriptPath}" nonce="${nonce}"></script>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}