import * as vscode from 'vscode';
import DocumentStore from '../core/document.store';

export class CouchFileSystemProvider implements vscode.FileSystemProvider {
	public static scheme = 'couchdb-vs';

	onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

	constructor(private readonly documentStore: DocumentStore) {
		this.onDidChangeFile = new vscode.EventEmitter<
			vscode.FileChangeEvent[]
		>().event;
	}

	watch(
		uri: vscode.Uri,
		options: { readonly recursive: boolean; readonly excludes: readonly string[] }
	): vscode.Disposable {
		const document = this.documentStore.findByURI(uri);

		if (!document) {
			throw vscode.FileSystemError.FileNotFound('Document not found.');
		}

		return document;
	}

	stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
		const document = this.documentStore.findByURI(uri);

		if (!document) {
			throw vscode.FileSystemError.FileNotFound('Document not found.');
		}

		return {
			type: vscode.FileType.File,
			ctime: document.ctime,
			mtime: document.mtime,
			size: document.size,
		};
	}

	readDirectory(
		uri: vscode.Uri
	): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
		throw new Error('readDirectory method not implemented.');
	}

	createDirectory(uri: vscode.Uri): void | Thenable<void> {
		throw new Error('createDirectory method not implemented.');
	}

	readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
		const document = this.documentStore.findByURI(uri);

		if (!document) {
			throw vscode.FileSystemError.FileNotFound('Document not found.');
		}

		return new Uint8Array(Buffer.from(document.content));
	}

	writeFile(
		uri: vscode.Uri,
		content: Uint8Array,
		options: { readonly create: boolean; readonly overwrite: boolean }
	): void | Thenable<void> {
		throw new Error('writeFile method not implemented.');
	}

	delete(
		uri: vscode.Uri,
		options: { readonly recursive: boolean }
	): void | Thenable<void> {
		throw new Error('delete method not implemented.');
	}

	rename(
		oldUri: vscode.Uri,
		newUri: vscode.Uri,
		options: { readonly overwrite: boolean }
	): void | Thenable<void> {
		throw new Error('rename method not implemented.');
	}

	copy?(
		source: vscode.Uri,
		destination: vscode.Uri,
		options: { readonly overwrite: boolean }
	): void | Thenable<void> {
		throw new Error('copy method not implemented.');
	}
}
