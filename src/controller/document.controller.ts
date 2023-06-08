import * as vscode from 'vscode';
import CouchItem from '../provider/couch.item';
import DocumentStore from 'src/core/document.store';
import { CouchDocumentProvider } from 'src/provider/couch.document.provider';

export default class DocumentController {
	constructor(
		private readonly documentStore: DocumentStore,
		private readonly documentProvider: CouchDocumentProvider,
		private readonly documentView: vscode.TreeView<CouchItem>
	) {}

	public async refreshDocuments(): Promise<void> {}
}
