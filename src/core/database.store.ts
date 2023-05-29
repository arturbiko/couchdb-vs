import DataStore from 'src/api/data.interface';
import DatabaseProvider from 'src/api/database.provider';
import { Database } from 'src/provider/couch.collection';
import { TreeItemCollapsibleState } from 'vscode';

export default class DatabaseStore extends DataStore<Database> {
	constructor(private readonly databaseProvider: DatabaseProvider) {
		super();
	}

	public async update(): Promise<void> {
		const list = await this.databaseProvider.fetchDatabases();

		this.data = list.map(
			(name) => new Database(name, TreeItemCollapsibleState.None)
		);
	}
}
