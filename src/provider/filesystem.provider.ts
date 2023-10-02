import * as vscode from 'vscode';
import DocumentStore from '../core/document.store';
import { TextEncoder } from 'util';
import { Document } from './couch.collection';

export class CouchFileSystemProvider implements vscode.FileSystemProvider {
	public static scheme = 'couchdb';

	onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

	constructor(private readonly documentStore: DocumentStore) {
		this.onDidChangeFile = new vscode.EventEmitter<
			vscode.FileChangeEvent[]
		>().event;
	}

	public watch(
		uri: vscode.Uri,
		options: { readonly recursive: boolean; readonly excludes: readonly string[] }
	): vscode.Disposable {
		console.log('watch', uri, options);

		return new vscode.Disposable(() => {});
	}

	public stat(uri: vscode.Uri): vscode.FileStat {
		const doc = this.documentStore.findByURI(uri);

		return {
			type: vscode.FileType.File,
			ctime: (doc as Document).ctime,
			mtime: (doc as Document).mtime,
			size: new TextEncoder().encode((doc as Document).content || '').length,
		};
	}

	public readDirectory(
		uri: vscode.Uri
	): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
		console.log('readDirectory', uri);

		return Promise.reject();
	}

	public createDirectory(uri: vscode.Uri): void | Thenable<void> {
		console.log('createDirectory', uri);

		return Promise.reject();
	}

	public async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const document = await this.documentStore.get({
			source: uri.authority,
			_id: uri.path.slice(1),
		});

		if (!document) {
			throw new Error('Document not found');
		}

		return new TextEncoder().encode(document.content);
	}

	public writeFile(
		uri: vscode.Uri,
		content: Uint8Array,
		options: { readonly create: boolean; readonly overwrite: boolean }
	): void | Thenable<void> {
		console.log('writeFile', uri, content, options);

		return Promise.reject();
	}

	public delete(
		uri: vscode.Uri,
		options: { readonly recursive: boolean }
	): void | Thenable<void> {
		console.log('delete', uri, options);

		return Promise.reject();
	}

	public rename(
		oldUri: vscode.Uri,
		newUri: vscode.Uri,
		options: { readonly overwrite: boolean }
	): void | Thenable<void> {
		console.log('rename', oldUri, newUri, options);

		return Promise.reject();
	}

	public copy?(
		source: vscode.Uri,
		destination: vscode.Uri,
		options: { readonly overwrite: boolean }
	): void | Thenable<void> {
		console.log('copy', source, destination, options);

		return Promise.reject();
	}
}
