import * as vscode from 'vscode';
import CouchItem, { ViewType } from './couch.item';
import CouchModel from './couch.model';
import { Page } from './couch.collection';

export class CouchDocumentProvider
	implements vscode.TreeDataProvider<CouchItem>
{
	private view: vscode.TreeView<CouchItem> | undefined;

	private _onDidChangeTreeData: vscode.EventEmitter<CouchItem | undefined> =
		new vscode.EventEmitter<CouchItem | undefined>();

	private readonly model: CouchModel;

	readonly onDidChangeTreeData: vscode.Event<CouchItem | undefined> =
		this._onDidChangeTreeData.event;

	constructor(model: CouchModel) {
		this.model = model;
	}

	public registerView(view: vscode.TreeView<CouchItem>): void {
		this.view = view;
	}

	public getTreeItem(
		element: CouchItem
	): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	public getChildren(
		element?: CouchItem | undefined
	): vscode.ProviderResult<CouchItem[]> {
		if (!element) {
			return this.model.pagedDocuments();
		}

		if (element?.type === ViewType.PAGE) {
			return this.model.listDocuments((element as Page).pageNumber);
		}

		return this.model.pagedDocuments();
	}

	public refresh(): void {
		if (this.view) {
			this.view.title = `Documents (${this.model.documentCount})`;
		}

		this._onDidChangeTreeData.fire(undefined);
	}
}
