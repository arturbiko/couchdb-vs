import * as vscode from 'vscode';
import CouchItem from './couch.item';
import { Page } from './couch.collection';
import CouchModel from './couch.model';

export class CouchDataProvider implements vscode.TreeDataProvider<CouchItem> {
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
		if (!element) {
			return this.model.listDatabases();
		}

		if (element && element.isPage) {
			return (element as Page).list();
		}

		return [];
	}

	refresh(): void {
		// this._onDidChangeTreeData.fire();
	}
}
