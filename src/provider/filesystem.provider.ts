import * as vscode from 'vscode';
import DocumentStore from '../core/document.store';
import { FileSystemError } from 'vscode';

export class CouchFileSystemProvider implements vscode.FileSystemProvider {
	public static scheme = 'couchdb';

	private readonly _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();

	readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;
	private readonly watchers = new Map<string, Set<Symbol>>;

	constructor(private readonly documentStore: DocumentStore) {
		this._emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
		this.onDidChangeFile = this._emitter.event;
	}

	watch(resource: vscode.Uri): vscode.Disposable {
		return new vscode.Disposable(() => undefined);
	}

	public async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		const document = this.documentStore.findByURI(uri);
		if (!document) {
			throw FileSystemError.FileNotFound;
		}

		return {
			type: vscode.FileType.File,
			ctime: 0,
			mtime: document.mtime,
			size: document.size,
		};
	}

	public readDirectory(
		uri: vscode.Uri
	): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
		return Promise.reject();
	}

	public createDirectory(uri: vscode.Uri): void | Thenable<void> {
		return Promise.reject();
	}

	public async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const document = await this.documentStore.get(uri);
		if (!document) {
			throw FileSystemError.FileNotFound;
		}

		try {
			return document.getContent();
		} catch (error) {
			throw new Error();
		}
	}

	public async writeFile(
		uri: vscode.Uri,
		content: Uint8Array,
		options: { readonly create: boolean; readonly overwrite: boolean }
	): Promise<void> {
		try {
			await this.documentStore.put(uri, content);
			
			this._emitter.fire([{ type: vscode.FileChangeType.Changed, uri }]);

			return Promise.resolve();
		} catch (error) {
			return Promise.reject(error);
		}
	}

	public delete(
		uri: vscode.Uri,
		options: { readonly recursive: boolean }
	): void | Thenable<void> {
		return Promise.reject();
	}

	public rename(
		oldUri: vscode.Uri,
		newUri: vscode.Uri,
		options: { readonly overwrite: boolean }
	): void | Thenable<void> {
		return Promise.reject();
	}

	public copy?(
		source: vscode.Uri,
		destination: vscode.Uri,
		options: { readonly overwrite: boolean }
	): void | Thenable<void> {
		return Promise.reject();
	}
}
