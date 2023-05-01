import * as vscode from 'vscode';
import CouchItem from './couch.item';
import path = require('path');

export class Page extends CouchItem {
	public isPage: boolean = true;

	private elements: Row[] = [];

	public add(element: Row): void {
		this.elements.push(element);
	}

	public list(): Row[] {
		return this.elements;
	}
}

export class Row extends CouchItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);

		this.iconPath = {
			light: path.join(__filename, '..', '..', 'assets', 'light', 'db-row.svg'),
			dark: path.join(__filename, '..', '..', 'assets', 'dark', 'db-row.svg'),
		};
	}
}
