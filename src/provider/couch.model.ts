import * as vscode from 'vscode';
import ConnectionService from '@service/connection.service';
import { Database, Document, Page } from './couch.collection';
import CouchItem from './couch.item';
import { DocumentGetResponse } from 'nano';
import { CouchResponse } from '@api/couch.interface';

export const PAGE_SIZE = 10;

interface PaginatedData {
	items: {
		[key: number]: CouchItem[];
	};
	pages: number;
	offset: number;
}

interface DocumentsResponseData {
	offset: number;
	rows: any[];
	total_rows: number;
}

export default class CouchModel {
	private connection: ConnectionService;

	private databases: PaginatedData;

	private documents: PaginatedData;

	private activeDatabase: string | undefined;

	constructor() {
		this.connection = new ConnectionService();

		this.databases = {
			items: [],
			pages: 0,
			offset: 0,
		};

		this.documents = {
			items: [],
			pages: 0,
			offset: 0,
		};
	}

	public listDatabases(): CouchItem[] {
		return this.databases.items[0];
	}

	public async listDocuments(page?: number): Promise<CouchItem[]> {
		if (!this.activeDatabase) {
			throw Error('Could not fetch documents.');
		}

		await this.fetchDocuments(this.activeDatabase, page ? page * PAGE_SIZE : 0);

		return this.documents.items[page || 0];
	}

	public async pagedDocuments(): Promise<CouchItem[]> {
		if (!this.activeDatabase) {
			return [];
		}

		await this.fetchDocuments(this.activeDatabase);

		const pages: Page[] = [];

		for (let i = 0; i < this.documents.pages; ++i) {
			pages.push(
				new Page(
					`Page ${i + 1}`,
					i + 1 === 1
						? vscode.TreeItemCollapsibleState.Expanded
						: vscode.TreeItemCollapsibleState.Collapsed,
					i
				)
			);
		}

		return pages;
	}

	public async fetchDocuments(database: string, offset?: number): Promise<void> {
		this.activeDatabase = database;

		const couch = await this.connection.instance();

		const response = await couch.request({
			db: database,
			path: '_all_docs',
			method: 'get',
			body: {
				offset: offset || 0,
			},
		});

		const items = response.rows.map((document: CouchResponse) => {
			return new Document(
				document,
				database,
				vscode.TreeItemCollapsibleState.None
			);
		});

		this.documents = {
			items: {
				...this.documents.items,
				[response.offset > 0 ? Math.max(response.offset / PAGE_SIZE) : 0]: items,
			},
			pages: Math.max(response.total_rows / PAGE_SIZE),
			offset: response.offset,
		};
	}

	public async fetchDocument(document: Document): Promise<DocumentGetResponse> {
		const couch = await this.connection.instance();

		const db = couch.use(document.source);

		return db.get(document._id, {});
	}

	public async fetchDatabases(): Promise<void> {
		const couch = await this.connection.instance();

		const items = (await couch.db.list()).map((name) => {
			return new Database(name, vscode.TreeItemCollapsibleState.None);
		});

		this.databases = {
			items: {
				0: items,
			},
			pages: items.length === 0 ? 1 : Math.max(items.length / PAGE_SIZE),
			offset: 0,
		};
	}
}
