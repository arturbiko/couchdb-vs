import * as vscode from 'vscode';
import path = require('path');
import CouchExtension from './couch.extension';

export function extensionId(sub?: string): string {
	let extensionId = 'couchdb-vs';

	if (!sub) {
		return extensionId;
	}

	return `${extensionId}.${sub}`;
}

export function iconPath(name: string) {
	return path.join(__dirname, '..', 'resources', name);
}

export function activate(context: vscode.ExtensionContext) {
	const myExtension = new CouchExtension(context);
	myExtension.activate();
}
