import CouchItem from 'src/provider/couch.item';

export default abstract class DataStore<T extends CouchItem> {
	protected data: T[] = [];

	public list(): T[] {
		return this.data;
	}

	public paged(): T[] {
		return this.data;
	}

	public findByName(name: string): T | undefined {
		return this.data.find((element) => element.label === name);
	}

	public size(): number {
		return this.data.length;
	}

	abstract update(): Promise<void>;
}
