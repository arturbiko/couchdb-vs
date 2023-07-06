import * as vscode from 'vscode';
import CouchItem, { ViewType } from './couch.item';
import DocumentStore from '../core/document.store';

export class CouchDocumentProvider
	implements vscode.TreeDataProvider<CouchItem>
{
	private _onDidChangeTreeData: vscode.EventEmitter<CouchItem | undefined> =
		new vscode.EventEmitter<CouchItem | undefined>();

	readonly onDidChangeTreeData: vscode.Event<CouchItem | undefined> =
		this._onDidChangeTreeData.event;

	constructor(private readonly documentStore: DocumentStore) {}

	public getTreeItem(
		element: CouchItem
	): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	public getChildren(
		element?: CouchItem | undefined
	): vscode.ProviderResult<CouchItem[]> {
		return this.documentStore.list();
	}

	public refresh(view?: vscode.TreeView<CouchItem>): void {
		if (view) {
			view.title = `Documents (${this.documentStore.size()})`;
		}

		this._onDidChangeTreeData.fire(undefined);
	}
}
