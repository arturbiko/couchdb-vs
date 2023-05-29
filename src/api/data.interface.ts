import CouchItem from 'src/provider/couch.item';

export default abstract class DataStore<T extends CouchItem> {
	protected data: T[] = [];

	abstract update(): Promise<void>;

	public findByName(name: string): T | undefined {
		return this.data.find((element) => element.label === name);
	}
}
