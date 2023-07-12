import * as vscode from 'vscode';
import { CouchFileSystemProvider } from '../provider/filesystem.provider';
import DocumentStore from '../core/document.store';

export default class EditorService {
	private provider: CouchFileSystemProvider;

	constructor(
		private readonly context: vscode.ExtensionContext,
		private readonly documentStore: DocumentStore
	) {
		this.provider = new CouchFileSystemProvider(documentStore);

		const providerRegistration = vscode.Disposable.from(
			vscode.workspace.registerFileSystemProvider(
				CouchFileSystemProvider.scheme,
				this.provider
			)
		);

		this.context.subscriptions.push(providerRegistration);
	}
}
