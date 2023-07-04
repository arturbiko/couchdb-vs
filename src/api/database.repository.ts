import ConnectionService from '../service/connection.service';

export default class DatabaseRepository {
	public constructor(private readonly connection: ConnectionService) {}

	public async fetchDatabases(): Promise<string[]> {
		const couch = await this.connection.instance();

		return await couch.db.list();
	}
}
