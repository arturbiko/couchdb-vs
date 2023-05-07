import * as vscode from 'vscode';
import { Document } from '../provider/couch.collection';
import CouchModel from '../provider/couch.model';
import DocumentEditorProvider from '../provider/couch.editor.provider';

export default class EditorService {
	private provider: DocumentEditorProvider;

	constructor(
		private readonly model: CouchModel,
		private readonly context: vscode.ExtensionContext
	) {
		this.provider = new DocumentEditorProvider();

		const providerRegistrations = vscode.Disposable.from(
			vscode.workspace.registerTextDocumentContentProvider(
				DocumentEditorProvider.scheme,
				this.provider
			)
		);

		this.context.subscriptions.push(this.provider, providerRegistrations);
	}

	public async openDocument(document: Document): Promise<void> {
		if (!this.provider) {
			return;
		}

		const uri = vscode.Uri.parse(
			`${DocumentEditorProvider.scheme}:${document._id}`
		);
		this.provider.addDocument(uri, document);

		const doc = await vscode.workspace.openTextDocument(uri);
		vscode.window.showTextDocument(doc, { preview: false });
		vscode.languages.setTextDocumentLanguage(doc, 'json');
	}
}
