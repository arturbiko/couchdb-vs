import * as vscode from 'vscode';
import CouchItem from '../provider/couch.item';
import DocumentStore from '../core/document.store';
import { CouchDocumentProvider } from '../provider/couch.document.provider';
import { Document } from '../provider/couch.collection';
import EditorService from '../service/editor.service';

export default class DocumentController {
	private readonly editorService: EditorService;

	constructor(
		private readonly documentStore: DocumentStore,
		private readonly documentProvider: CouchDocumentProvider,
		private readonly documentView: vscode.TreeView<CouchItem>,
		private readonly context: vscode.ExtensionContext
	) {
		this.editorService = new EditorService(context);
	}

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
			const data = await this.documentStore.get(document);

			this.documentProvider.refresh(this.documentView);

			document.setRev(data._rev);
			document.setContent(JSON.stringify(data, null, '\t'));
			await this.editorService.openDocument(document);
		} catch (error) {
			vscode.window.showErrorMessage('Document was removed.');

			await this.documentStore.remove(document);
			this.documentProvider.refresh(this.documentView);
		}
	}
}
