import CouchItem from '../provider/couch.item';

export default abstract class DataStore<T extends CouchItem> {
	protected data: T[] = [];

	public findByName(name: string): T | undefined {
		return this.data.find((element) => element.label === name);
	}

	public size(): number {
		return this.data.length;
	}

	abstract list(): T[];

	abstract update(): Promise<void>;
}
