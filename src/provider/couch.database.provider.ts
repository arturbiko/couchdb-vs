import * as vscode from 'vscode';
import CouchItem from './couch.item';
import CouchModel from './couch.model';

export class CouchDataProvider implements vscode.TreeDataProvider<CouchItem> {
	private initialView = true;

	private _onDidChangeTreeData: vscode.EventEmitter<CouchItem | undefined> =
		new vscode.EventEmitter<CouchItem | undefined>();

	private readonly model: CouchModel;

	readonly onDidChangeTreeData: vscode.Event<CouchItem | undefined> =
		this._onDidChangeTreeData.event;

	constructor(model: CouchModel) {
		this.model = model;
	}

	getTreeItem(element: CouchItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: CouchItem): CouchItem[] {
		return this.model.listDatabases();
	}

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}
}
