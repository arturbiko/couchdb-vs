import * as vscode from 'vscode';
import CouchItem, { ViewType } from './couch.item';
import { extensionId, iconPath } from '../extension';
import { CouchResponse } from '../api/couch.interface';

export class Page extends CouchItem {
	public pageNumber: number;

	private elements: CouchItem[] = [];

	constructor(
		label: string,
		collapsibleState: vscode.TreeItemCollapsibleState,
		pageNumber: number,
		source: string
	) {
		super(label, collapsibleState);

		this.pageNumber = pageNumber;

		this.id = `${source}_${pageNumber}`;

		this.contextValue = 'page';
	}

	public get type(): ViewType {
		return ViewType.PAGE;
	}

	public add(element: CouchItem): void {
		this.elements.push(element);
	}

	public list(): CouchItem[] {
		return this.elements;
	}
}

export class Database extends CouchItem {
	constructor(
		public readonly label: string,
		public readonly command?: vscode.Command
	) {
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

	public get type(): ViewType {
		return ViewType.DATABASE;
	}
}

export class Document extends CouchItem {
	public _id: string;

	public _rev: string;

	public content: string | undefined;

	public source: string;

	constructor(
		document: CouchResponse,
		source: string,
		collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(document.id, collapsibleState);

		this._id = document.id;
		this._rev = document.value.rev;

		this.source = source;

		this.iconPath = iconPath('document-row.png');

		this.command = {
			command: extensionId('openDocument'),
			arguments: [this],
			title: 'view',
		};

		this.description = `_rev: ${this._rev}`;

		this.contextValue = 'document';
	}

	public get type(): ViewType {
		return ViewType.DOCUMENT;
	}

	public setContent(content: string | undefined): void {
		this.content = content;
	}

	public setRev(rev: string): void {
		this._rev = rev;
		this.description = `_rev: ${this._rev}`;
	}

	public hasChanged(updated: object): boolean {
		if (!(updated instanceof Document)) {
			return false;
		}

		return this._rev !== updated._rev;
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

	public get type(): ViewType {
		return ViewType.ACTION;
	}
}

export class Empty extends CouchItem {
	constructor(public readonly label: string) {
		super(label, vscode.TreeItemCollapsibleState.None);

		this.contextValue = 'empty';
	}

	public get type(): ViewType {
		return ViewType.EMPTY;
	}
}
