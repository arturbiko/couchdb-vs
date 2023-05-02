import * as vscode from 'vscode';
import ConnectionService from '../service/connection.service';
import { Row } from './couch.collection';
import CouchItem from './couch.item';

export const PAGE_SIZE = 10;

interface PaginatedData {
	items: Row[];
	pages: number;
}

export default class CouchModel {
	private databases: PaginatedData;

	private connection: ConnectionService;

	constructor() {
		this.connection = new ConnectionService();

		this.databases = {
			items: [],
			pages: 0,
		};
	}

	public async fetchAll(): Promise<void> {
		try {
			await this.fetchDatabases();
		} catch (error: any) {
			vscode.window.showErrorMessage(
				`Error connecting to CouchDB: ${error.message}`
			);
		}
	}

	public listDatabases(): CouchItem[] {
		return this.databases.items;
	}

	private async fetchDatabases(): Promise<void> {
		const couch = this.connection.instance();

		const items = (await couch.db.list()).map((db) => {
			return new Row(db, vscode.TreeItemCollapsibleState.None);
		});

		this.databases = {
			items: items,
			pages: items.length === 0 ? 1 : Math.max(items.length / PAGE_SIZE),
		};
	}
}
