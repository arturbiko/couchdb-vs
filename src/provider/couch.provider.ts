import * as vscode from 'vscode';
import CouchRow from './couch.item';
import nano = require('nano');
import { extensionId } from '../extension';

export class CouchDataProvider implements vscode.TreeDataProvider<CouchRow> {
	private _onDidChangeTreeData: vscode.EventEmitter<CouchRow | undefined> =
		new vscode.EventEmitter<CouchRow | undefined>();

	readonly onDidChangeTreeData: vscode.Event<CouchRow | undefined> =
		this._onDidChangeTreeData.event;

	getTreeItem(element: CouchRow): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: CouchRow): Promise<CouchRow[]> {
		const config = vscode.workspace.getConfiguration(extensionId());
		const host = config.get<string>('host');
		const username = config.get<string>('username');
		const password = config.get<string>('password');

		const dbUrl = `http://${username}:${password}@${host}`;

		try {
			const couch = nano(dbUrl);
			const dbList = await couch.db.list();

			const items = dbList.map((name) => {
				return new CouchRow(name, vscode.TreeItemCollapsibleState.Collapsed);
			});

			return items;
		} catch (error: any) {
			vscode.window.showErrorMessage(
				`Error connecting to CouchDB: ${error.message}`
			);
			return [];
		}
	}

	refresh(): void {
		// this._onDidChangeTreeData.fire();
	}
}
