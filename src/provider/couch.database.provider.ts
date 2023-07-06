import * as vscode from 'vscode';
import CouchItem from './couch.item';
import DatabaseStore from '../core/database.store';

export class CouchDataProvider implements vscode.TreeDataProvider<CouchItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<CouchItem | undefined> =
		new vscode.EventEmitter<CouchItem | undefined>();

	private view: vscode.TreeView<CouchItem> | undefined;

	readonly onDidChangeTreeData: vscode.Event<CouchItem | undefined> =
		this._onDidChangeTreeData.event;

	constructor(private readonly databaseStore: DatabaseStore) {}

	public getParent(element: CouchItem): vscode.ProviderResult<CouchItem> {
		return undefined;
	}

	public getTreeItem(element: CouchItem): vscode.TreeItem {
		return element;
	}

	public getChildren(element?: CouchItem): vscode.ProviderResult<CouchItem[]> {
		return this.databaseStore.list();
	}

	public refresh(view?: vscode.TreeView<CouchItem>): void {
		if (view) {
			view.title = `Databases (${this.databaseStore.size()})`;
		}

		this._onDidChangeTreeData.fire(undefined);
	}
}
