import ConnectionService from '../service/connection.service';

export default class DocumentRepository {
	public constructor(private readonly connection: ConnectionService) {}

	public async fetchDocuments(): Promise<string[]> {
		const couch = await this.connection.instance();

		return await couch.db.list();
	}
}
