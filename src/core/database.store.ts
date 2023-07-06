import { ViewType } from '../provider/couch.item';
import DataStore from '../api/data.interface';
import DatabaseRepository from '../api/database.repository';
import { Database, Empty } from '../provider/couch.collection';

export default class DatabaseStore extends DataStore<Database> {
	private total: number = 0;

	constructor(private readonly databaseRepository: DatabaseRepository) {
		super();
	}

	public list(): Database[] {
		if (this.total === 0) {
			this.data.push(new Empty('No Databases available'));
		}

		return this.data;
	}

	public async create(name: string): Promise<Database> {
		try {
			await this.databaseRepository.create(name);
		} catch (error) {
			return Promise.reject(error);
		}

		const database = new Database(name);

		this.data.push(database);

		this.data = this.data.filter((entry) => entry.type !== ViewType.EMPTY);
		++this.total;

		return database;
	}

	public async remove(database: Database): Promise<void> {
		await this.databaseRepository.remove(database);

		this.data = this.data.filter((d) => d.label !== database.label);

		--this.total;
	}

	public async update(): Promise<void> {
		const list = await this.databaseRepository.fetchDatabases();

		this.total = list.length;

		this.data = list.map((name) => new Database(name));
	}
}
