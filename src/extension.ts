import * as vscode from 'vscode';
import CouchExtension from './couch.extension';

export function extensionId(sub?: string): string {
	let extensionId = 'couchdb-vs';

	if (!sub) {
		return extensionId;
	}

	return `${extensionId}.${sub}`;
}

export function activate(context: vscode.ExtensionContext) {
	console.log(extensionId());

	const myExtension = new CouchExtension(context);
	myExtension.activate();
}
