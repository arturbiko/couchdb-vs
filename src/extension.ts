import * as vscode from 'vscode';
import SidebarProvider from './view/SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, new SidebarProvider(context.extensionUri)));
}

export function deactivate() {}
