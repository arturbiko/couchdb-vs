import * as vscode from 'vscode';
import CouchItem from '../provider/couch.item';
import DocumentStore from '../core/document.store';
import { CouchDocumentProvider } from '../provider/couch.document.provider';
import { Document } from 'src/provider/couch.collection';

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
	}
}
