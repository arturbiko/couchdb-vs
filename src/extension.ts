import * as vscode from 'vscode';
import CouchExtension from './couch.extension';

export function extensionId(sub: string): string {
	return `couchDBVS.${sub}`;
}

export function activate(context: vscode.ExtensionContext) {
	const myExtension = new CouchExtension();
	myExtension.activate(context);
}

export function deactivate() {
	console.log('Your extension has been deactivated.');
}
