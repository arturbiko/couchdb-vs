import * as vscode from 'vscode';

export class CouchFileSystemProvider implements vscode.FileSystemProvider {
	public static scheme = 'couchdb';

	onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

	constructor() {
		this.onDidChangeFile = new vscode.EventEmitter<
			vscode.FileChangeEvent[]
		>().event;
	}

	watch(
		uri: vscode.Uri,
		options: { readonly recursive: boolean; readonly excludes: readonly string[] }
	): vscode.Disposable {
		throw new Error('Method not implemented.');
	}

	stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
		throw new Error('Method not implemented.');
	}

	readDirectory(
		uri: vscode.Uri
	): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
		throw new Error('Method not implemented.');
	}

	createDirectory(uri: vscode.Uri): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}

	readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
		throw new Error('Method not implemented.');
	}

	writeFile(
		uri: vscode.Uri,
		content: Uint8Array,
		options: { readonly create: boolean; readonly overwrite: boolean }
	): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}

	delete(
		uri: vscode.Uri,
		options: { readonly recursive: boolean }
	): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}

	rename(
		oldUri: vscode.Uri,
		newUri: vscode.Uri,
		options: { readonly overwrite: boolean }
	): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}

	copy?(
		source: vscode.Uri,
		destination: vscode.Uri,
		options: { readonly overwrite: boolean }
	): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}
}
