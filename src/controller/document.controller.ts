import * as vscode from 'vscode';
import CouchItem from '../provider/couch.item';
import DocumentStore from '../core/document.store';
import { CouchDocumentProvider } from '../provider/couch.document.provider';
import { Document } from '../provider/couch.collection';

export default class DocumentController {
	constructor(
		private readonly documentStore: DocumentStore,
		private readonly documentProvider: CouchDocumentProvider,
		private readonly documentView: vscode.TreeView<CouchItem>
	) {}

	public async refreshDocuments(): Promise<void> {
		try {
			await this.documentStore.update();

			this.documentProvider.refresh(this.documentView);
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}

	public async loadDocuments(): Promise<void> {
		try {
			await this.documentStore.update();

			this.documentProvider.refresh(this.documentView);
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}

	public async removeDocument(document: Document): Promise<void> {
		try {
			await this.documentStore.remove(document);

			this.documentProvider.refresh(this.documentView);

			vscode.window.showInformationMessage(
				`Successfully removed ${document.label}.`
			);
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}

	public clearData(): void {
		this.documentStore.clear();

		this.documentProvider.refresh(this.documentView);
	}

	public async openDocument(document: Document): Promise<void> {
		try {
			this.documentProvider.refresh(this.documentView);

			// open the document in a new editor
			const doc = await vscode.workspace.openTextDocument(document.uri);

			// set json language mode
			await vscode.languages.setTextDocumentLanguage(doc, 'json');

			vscode.window.showTextDocument(doc);
		} catch (error) {
			vscode.window.showErrorMessage('Document was removed.');

			await this.documentStore.remove(document);
			this.documentProvider.refresh(this.documentView);
		}
	}
}
