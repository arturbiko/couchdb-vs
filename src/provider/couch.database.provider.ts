import * as vscode from 'vscode';
import CouchItem from './couch.item';
import CouchModel from './couch.model';

export class CouchDataProvider implements vscode.TreeDataProvider<CouchItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<CouchItem | undefined> =
		new vscode.EventEmitter<CouchItem | undefined>();

	private view: vscode.TreeView<CouchItem> | undefined;

	private readonly model: CouchModel;

	readonly onDidChangeTreeData: vscode.Event<CouchItem | undefined> =
		this._onDidChangeTreeData.event;

	constructor(model: CouchModel) {
		this.model = model;
	}

	public registerView(view: vscode.TreeView<CouchItem>): void {
		this.view = view;
	}

	public getParent(element: CouchItem): vscode.ProviderResult<CouchItem> {
		return undefined;
	}

	public getTreeItem(element: CouchItem): vscode.TreeItem {
		return element;
	}

	public getChildren(element?: CouchItem): CouchItem[] {
		return this.model.listDatabases();
	}

	public selectChild(id: string): void {
		if (!this.view) {
			return;
		}

		const database = this.model.listDatabases().find((db) => db.id === id);

		if (!database) {
			return;
		}

		this.view.reveal(database, { focus: true, select: true });
	}

	public refresh(): void {
		if (this.view && this.model.databaseCount > 0) {
			this.view.title = `Databases (${this.model.databaseCount})`;
		}

		this._onDidChangeTreeData.fire(undefined);
	}
}
