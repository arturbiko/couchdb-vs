import * as vscode from 'vscode';
import CouchItem from './couch.item';
import path = require('path');
import { extensionId } from '@/extension';
import { CouchResponse } from '@/api/couch.interface';

export class Page extends CouchItem {
	public isPage: boolean = true;

	public pageNumber: number;

	private elements: CouchItem[] = [];

	constructor(
		label: string,
		collapsibleState: vscode.TreeItemCollapsibleState,
		pageNumber: number
	) {
		super(label, collapsibleState);

		this.pageNumber = pageNumber;
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
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.command = {
			command: extensionId('selectDatabase'),
			arguments: [label],
			title: 'select',
		};

		this.iconPath = path.join(__filename, '..', '..', 'resources', 'db-row.svg');
	}
}

export class Document extends CouchItem {
	public isDocument: boolean = true;

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
		this._rev = document.rev;

		this.source = source;

		this.iconPath = path.join(
			__filename,
			'..',
			'..',
			'resources',
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
