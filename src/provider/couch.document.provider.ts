import * as vscode from 'vscode';
import CouchItem from './couch.item';
import CouchModel from './couch.model';
import { Page } from './couch.collection';

export class CouchDocumentProvider
	implements vscode.TreeDataProvider<CouchItem>
{
	private _onDidChangeTreeData: vscode.EventEmitter<CouchItem | undefined> =
		new vscode.EventEmitter<CouchItem | undefined>();

	private readonly model: CouchModel;

	readonly onDidChangeTreeData: vscode.Event<CouchItem | undefined> =
		this._onDidChangeTreeData.event;

	constructor(model: CouchModel) {
		this.model = model;
	}

	getTreeItem(element: CouchItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(
		element?: CouchItem | undefined
	): vscode.ProviderResult<CouchItem[]> {
		if (!element) {
			return this.model.pagedDocuments();
		}

		if (element && element.isPage) {
			return this.model.listDocuments((element as Page).pageNumber);
		}

		return this.model.pagedDocuments();
	}

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}
}
