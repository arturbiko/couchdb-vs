import * as vscode from 'vscode';
import CouchItem from './couch.item';
import path = require('path');
import { extensionId } from '../extension';

export class Page extends CouchItem {
	public isPage: boolean = true;

	public pageNumber: number;

	private elements: CouchItem[] = [];

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		pageNumber: number
	) {
		super(label, collapsibleState);

		this.pageNumber = pageNumber;
	}

	public add(element: Database): void {
		this.elements.push(element);
	}

	public list(): CouchItem[] {
		return this.elements;
	}
}

export class Database extends CouchItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.command = {
			command: extensionId('selectDatabase'),
			arguments: [label],
			title: 'info',
		};

		this.iconPath = {
			light: path.join(__filename, '..', '..', 'assets', 'light', 'db-row.svg'),
			dark: path.join(__filename, '..', '..', 'assets', 'dark', 'db-row.svg'),
		};
	}
}

export class Document extends CouchItem {
	public _id: string;

	public _rev: string;

	public content: string | undefined;

	readonly source: string;

	constructor(
		public readonly document: { id: string; rev: string },
		public database: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(document.id, collapsibleState);

		this._id = document.id;
		this._rev = document.rev;

		this.source = database;

		this.iconPath = path.join(
			__filename,
			'..',
			'..',
			'assets',
			'dark',
			'document-row.svg'
		);

		this.command = {
			command: extensionId('openDocument'),
			arguments: [this],
			title: 'view',
		};
	}

	public setContent(content: string | undefined): void {
		this.content = content;
	}
}
