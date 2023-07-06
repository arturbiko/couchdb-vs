import { DocumentGetResponse } from 'nano';
import { Database, Document } from '../provider/couch.collection';
import ConnectionService from '../service/connection.service';
import { CouchResponse } from './couch.interface';

export const PAGE_SIZE = 10;

export default class DocumentRepository {
	public database?: Database;

	public constructor(private readonly connection: ConnectionService) {}

	public setActiveDatabase(database?: Database): void {
		this.database = database;
	}

	public async fetchDocuments(
		offset = 0
	): Promise<{ data: CouchResponse[]; total: number }> {
		if (!this.database) {
			throw new Error('Database not selected');
		}

		const couch = await this.connection.instance();

		const response = await couch.request({
			db: this.database.label,
			path: '_all_docs',
			method: 'post',
			body: {
				skip: offset,
				limit: PAGE_SIZE,
			},
		});

		return {
			data: response.rows,
			total: response.total_rows,
		};
	}

	public async get(document: Document): Promise<DocumentGetResponse> {
		const couch = await this.connection.instance();

		const db = couch.use(document.source);

		return db.get(document._id, {});
	}

	public async remove(document: Document): Promise<void> {
		const couch = await this.connection.instance();

		const db = couch.use(document.source);

		await db.destroy(document._id, document._rev);
	}
}
