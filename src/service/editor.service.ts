import * as vscode from 'vscode';
import { Document } from '../provider/couch.collection';
import DocumentEditorProvider from '../provider/couch.editor.provider';

export default class EditorService {
	private provider: DocumentEditorProvider;

	constructor(private readonly context: vscode.ExtensionContext) {
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
			`${DocumentEditorProvider.scheme}:${document.source}_${document._id}.json`
		);
		const existing = this.provider.find(uri);
		this.provider.set(uri, document);

		const doc = await vscode.workspace.openTextDocument(uri);

		if (existing && (existing as Document).hasChanged(document)) {
			const entireDocumentRange = new vscode.Range(0, 0, doc?.lineCount || 0, 0);
			const edit = new vscode.WorkspaceEdit();
			edit.replace(uri, entireDocumentRange, document.content || '');

			vscode.workspace.applyEdit(edit);
		}

		vscode.window.showTextDocument(doc, { preview: false });
		vscode.languages.setTextDocumentLanguage(doc, 'json');
	}
}
