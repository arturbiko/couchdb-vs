import { Database } from '../provider/couch.collection';
import ConnectionService from '../service/connection.service';

export default class DatabaseRepository {
	public constructor(private readonly connection: ConnectionService) {}

	public async fetchDatabases(): Promise<string[]> {
		const couch = await this.connection.instance();

		return await couch.db.list();
	}

	public async create(name: string): Promise<void> {
		const couch = await this.connection.instance();

		await couch.db.create(name);
	}

	public async remove(database: Database): Promise<void> {
		const couch = await this.connection.instance();

		await couch.db.destroy(database.label);
	}
}
