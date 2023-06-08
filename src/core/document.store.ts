import DataStore from 'src/api/data.interface';
import DocumentRepository from 'src/api/document.repository';
import { Document } from 'src/provider/couch.collection';

export default class DocumentStore extends DataStore<Document> {
	constructor(private readonly documentRepository: DocumentRepository) {
		super();
	}

	public async update(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
