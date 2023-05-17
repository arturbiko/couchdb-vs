import * as vscode from 'vscode';
import ConnectionService from '../service/connection.service';
import { Database, Document, Empty, Page } from './couch.collection';
import CouchItem from './couch.item';
import { DocumentGetResponse } from 'nano';
import { CouchResponse } from '../api/couch.interface';

export const PAGE_SIZE = 10;

interface PaginatedData {
	items: {
		[key: number]: CouchItem[];
	};
	pages: number;
	offset: number;
	total: number;
}

export default class CouchModel {
	private databases: PaginatedData;

	private documents: PaginatedData;

	private activeDatabase: string | undefined;

	constructor(private readonly connection: ConnectionService) {
		this.databases = {
			items: {
				0: [],
			},
			pages: 0,
			offset: 0,
			total: 0,
		};

		this.documents = {
			items: {
				0: [],
			},
			pages: 0,
			offset: 0,
			total: 0,
		};
	}

	public get documentCount(): number {
		return this.documents.total;
	}

	public get databaseCount(): number {
		return this.databases.total;
	}

	public listDatabases(): CouchItem[] {
		return this.databases.items[0];
	}

	public async listDocuments(page?: number): Promise<CouchItem[]> {
		if (!this.activeDatabase) {
			throw Error('Could not fetch documents.');
		}

		await this.fetchDocuments(
			this.activeDatabase,
			page !== undefined ? (page - 1) * PAGE_SIZE : 0
		);

		return this.documents.items[page !== undefined ? page - 1 : 0];
	}

	public async pagedDocuments(): Promise<CouchItem[]> {
		if (!this.activeDatabase) {
			return [];
		}

		await this.fetchDocuments(this.activeDatabase);

		if (this.documents.pages === 0) {
			return this.documents.items[0];
		}

		const pages: Page[] = [];

		for (let i = 0; i < this.documents.pages; ++i) {
			pages.push(
				new Page(
					`Page ${i + 1}`,
					i + 1 === 1
						? vscode.TreeItemCollapsibleState.Expanded
						: vscode.TreeItemCollapsibleState.Collapsed,
					i + 1,
					this.activeDatabase
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
			method: 'post',
			body: {
				skip: offset || 0,
				limit: PAGE_SIZE,
			},
		});

		const items = response.rows.map((document: CouchResponse) => {
			return new Document(
				document,
				database,
				vscode.TreeItemCollapsibleState.None
			);
		});

		if (items.length > 0) {
			this.documents = {
				items: {
					...this.documents.items,
					[response.offset > 0 ? Math.round(response.offset / PAGE_SIZE) : 0]: items,
				},
				pages: Math.round(response.total_rows / PAGE_SIZE),
				offset: response.offset,
				total: response.total_rows,
			};
		} else {
			this.documents = {
				items: {
					0: [new Empty('No Documents available')],
				},
				pages: 0,
				offset: 0,
				total: 0,
			};
		}
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
				0: items.length > 0 ? items : [new Empty('No Databases available')],
			},
			pages: items.length === 0 ? 1 : Math.round(items.length / PAGE_SIZE),
			offset: 0,
			total: items.length,
		};
	}
}
