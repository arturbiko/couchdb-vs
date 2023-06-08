import { Database } from '../provider/couch.collection';
import ConnectionService from '../service/connection.service';

export default class DatabaseRepository {
	private active: Database | undefined;

	public constructor(private readonly connection: ConnectionService) {}

	public setActiveDatabase(database: Database) {
		this.active = database;
	}

	public async fetchDatabases(): Promise<string[]> {
		const couch = await this.connection.instance();

		return await couch.db.list();
	}
}
