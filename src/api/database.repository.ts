import { Database } from 'src/provider/couch.collection';
import ConnectionService from 'src/service/connection.service';

export default class DatabaseRepository {
	private static provider: DatabaseRepository | undefined;

	private active: Database | undefined;

	private constructor(private readonly connection: ConnectionService) {}

	public static instance(connection: ConnectionService): DatabaseRepository {
		if (!this.provider) {
			this.provider = new DatabaseRepository(connection);
		}

		return this.provider;
	}

	public setActiveDatabase(database: Database) {
		this.active = database;
	}

	public async fetchDatabases(): Promise<string[]> {
		const couch = await this.connection.instance();

		return await couch.db.list();
	}
}
