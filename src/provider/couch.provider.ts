import * as vscode from 'vscode';
import CouchRow from './couch.item';

export class CouchDataProvider implements vscode.TreeDataProvider<CouchRow> {
	private _onDidChangeTreeData: vscode.EventEmitter<CouchRow | undefined> =
		new vscode.EventEmitter<CouchRow | undefined>();

	readonly onDidChangeTreeData: vscode.Event<CouchRow | undefined> =
		this._onDidChangeTreeData.event;

	getTreeItem(element: CouchRow): vscode.TreeItem {
		return element;
	}

	getChildren(element?: CouchRow): Thenable<CouchRow[]> {
		// Implement logic for returning child elements here
		return Promise.resolve([]);
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}
