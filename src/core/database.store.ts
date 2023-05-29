import { TreeItemCollapsibleState } from 'vscode';
import DataStore from '../api/data.interface';
import DatabaseRepository from '../api/database.repository';
import { Database } from '../provider/couch.collection';

export default class DatabaseStore extends DataStore<Database> {
	constructor(private readonly databaseRepository: DatabaseRepository) {
		super();
	}

	public setDatabase(database: Database): void {
		this.databaseRepository.setActiveDatabase(database);
	}

	public async update(): Promise<void> {
		const list = await this.databaseRepository.fetchDatabases();

		this.data = list.map(
			(name) => new Database(name, TreeItemCollapsibleState.None)
		);
	}
}
