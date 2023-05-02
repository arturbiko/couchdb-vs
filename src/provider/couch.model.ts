import * as vscode from 'vscode';
import ConnectionService from '../service/connection.service';
import { Page, Row } from './couch.collection';
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
		return this.paginate(this.databases);
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

	private paginate(data: PaginatedData): CouchItem[] {
		// bail early if little element size
		if (data.pages <= 1) {
			return data.items;
		}

		// set up collections
		const pages: Page[] = [];

		let index = 0;
		let page = 0;
		let collection = null;
		for (const db of data.items) {
			if (index === PAGE_SIZE || !collection) {
				collection = new Page(
					`Page ${page + 1}`,
					page + 1 === 1
						? vscode.TreeItemCollapsibleState.Expanded
						: vscode.TreeItemCollapsibleState.Collapsed
				);

				index = 0;
				page += 1;

				pages.push(collection);
			}

			if (collection !== null) {
				collection.add(db);
				++index;
			}
		}

		return pages;
	}
}
