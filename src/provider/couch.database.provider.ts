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

	public getTreeItem(element: CouchItem): vscode.TreeItem {
		return element;
	}

	public getChildren(element?: CouchItem): CouchItem[] {
		return this.model.listDatabases();
	}

	public refresh(): void {
		if (this.view) {
			this.view.title = `Databases (${this.model.databaseCount})`;
		}

		this._onDidChangeTreeData.fire(undefined);
	}
}
