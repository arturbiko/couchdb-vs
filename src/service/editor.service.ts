import * as vscode from 'vscode';
import { CouchFileSystemProvider } from '../provider/filesystem.provider';

export default class EditorService {
	private provider: CouchFileSystemProvider;

	constructor(private readonly context: vscode.ExtensionContext) {
		this.provider = new CouchFileSystemProvider();

		const providerRegistration = vscode.Disposable.from(
			vscode.workspace.registerFileSystemProvider(
				CouchFileSystemProvider.scheme,
				this.provider
			)
		);

		this.context.subscriptions.push(providerRegistration);
	}
}
