import * as vscode from 'vscode';
import CouchItem, { ViewType } from './couch.item';
import { extensionId, iconPath } from '../extension';
import { CouchResponse } from '../api/couch.interface';
import { CouchFileSystemProvider } from './filesystem.provider';

export class Database extends CouchItem {
	constructor(label: string) {
		super(label, vscode.TreeItemCollapsibleState.None);

		this.id = label;

		this.command = {
			command: extensionId('selectDatabase'),
			arguments: [label],
			title: 'select',
		};

		this.iconPath = iconPath('db-row.png');

		this.contextValue = 'database';
	}

	public get viewType(): ViewType {
		return ViewType.DATABASE;
	}
}

export class Document extends CouchItem implements vscode.FileStat {
	public _id: string;

	public _rev: string;

	public content: string;

	public source: string;

	uri: vscode.Uri;

	public type: vscode.FileType = vscode.FileType.File;

	public ctime: number;

	public mtime: number;

	public size: number = 0;

	public permissions?: vscode.FilePermission | undefined;

	constructor(document: CouchResponse, source: string) {
		super(document.id, vscode.TreeItemCollapsibleState.None);

		this.uri = vscode.Uri.parse(
			`${CouchFileSystemProvider.scheme}://${source}/${document.id}`
		);

		this._id = document.id;
		this._rev = document.value.rev;

		this.source = source;

		this.iconPath = iconPath('document-row.png');

		this.command = {
			command: extensionId('openDocument'),
			arguments: [this],
			title: 'view',
		};

		this.content = '';
		this.description = `_rev: ${this._rev}`;

		this.contextValue = 'document';

		this.ctime = 0;
		this.mtime = 0;
	}

	public get viewType(): ViewType {
		return ViewType.DOCUMENT;
	}

	public setContent(content: string): void {
		this.content = content;

		this.size = Buffer.from(content).byteLength;
	}

	public setRev(rev: string): void {
		if (this._rev === rev) {
			return;
		}

		this._rev = rev;
		this.description = `_rev: ${this._rev}`;

		this.mtime = Date.now();
	}

	public dispose(): void {
		throw new Error('Method not implemented.');
	}
}

export class Load extends CouchItem {
	constructor(public readonly label: string) {
		super(label, vscode.TreeItemCollapsibleState.None);

		this.command = {
			command: extensionId('loadDocuments'),
			arguments: [],
			title: 'load',
		};

		this.contextValue = 'action';
	}

	public get viewType(): ViewType {
		return ViewType.ACTION;
	}
}

export class Empty extends CouchItem {
	constructor(public readonly label: string) {
		super(label, vscode.TreeItemCollapsibleState.None);

		this.contextValue = 'empty';
	}

	public get viewType(): ViewType {
		return ViewType.EMPTY;
	}
}
