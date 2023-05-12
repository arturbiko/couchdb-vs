import * as vscode from 'vscode';
import { Document } from './couch.collection';
import CouchItem, { ViewType } from './couch.item';

export default class DocumentEditorProvider
	implements vscode.TextDocumentContentProvider
{
	static scheme = 'couch';

	private _documents = new Map<string, CouchItem>();

	private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

	private _subscriptions: vscode.Disposable;

	constructor() {
		this._subscriptions = vscode.workspace.onDidCloseTextDocument((doc) =>
			this._documents.delete(doc.uri.toString())
		);
	}

	public provideTextDocumentContent(
		uri: vscode.Uri,
		token: vscode.CancellationToken
	): vscode.ProviderResult<string> {
		const document = this._documents.get(uri.toString());
		if (document?.type === ViewType.DOCUMENT) {
			return (document as Document).content;
		}

		return '';
	}

	public find(uri: vscode.Uri): CouchItem | undefined {
		return this._documents.get(uri.toString());
	}

	public set(uri: vscode.Uri, item: CouchItem): void {
		this._documents.set(uri.toString(), item);
	}

	public dispose() {
		this._subscriptions.dispose();
		this._onDidChange.dispose();
	}
}
