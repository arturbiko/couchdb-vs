import * as vscode from 'vscode';
import { CouchResponse } from '../api/couch.interface';
import DataStore from '../api/data.interface';
import DocumentRepository from '../api/document.repository';
import { Document, Empty, Load } from '../provider/couch.collection';
import CouchItem from '../provider/couch.item';

export default class DocumentStore extends DataStore<CouchItem> {
	private total = 0;

	constructor(private readonly documentRepository: DocumentRepository) {
		super();
	}

	public list(): CouchItem[] {
		const data = this.data.slice();

		if (this.documentRepository.database) {
			if (this.total === 0) {
				data.push(new Empty('No Documents avaialble'));
			}

			if (data.length < this.total) {
				data.push(new Load('Load more...'));
			}
		}

		return data;
	}

	public async get(uri: vscode.Uri): Promise<Document> {
		const document = this.findByURI(uri);
		if (!document) {
			throw new Error('Document not found');
		}

		const data = await this.documentRepository.get(document);
		document.setContent(data); // update doc with current data

		return document;
	}

	public async put(uri: vscode.Uri, data: Uint8Array): Promise<void> {
		const document = this.findByURI(uri);
		if (!document) {
			throw new Error('Document not found');
		}

		try {
			// inject current _id and _rev into content for update
			const content = JSON.parse(data.toString());
			content['_id'] = document._id;

			if (document._rev) {
				content['_rev'] = document._rev;
			}

			const rev = await this.documentRepository.put(document, content);

			document.setContent(content);
			document.setRev(rev);

		} catch (error) {
			throw new Error('Cannot update document.');
		}
	}

	public findByURI(uri: vscode.Uri): Document | undefined {
		return this.data.find((d) => {
			if (d instanceof Document) {
				return d.uri.toString() === uri.toString();
			}

			return false;
		}) as Document;
	}

	public async remove(document: Document): Promise<void> {
		try {
			await this.documentRepository.remove(document);
		} catch (error) {
			// TODO: Handle expected empty document
		}

		this.data = this.data.filter((d) => (d as Document)._id !== document._id);

		--this.total;
	}

	public async refresh(document: Document): Promise<void> {
		const index = this.data.findIndex((d) => (d as Document)._id === document._id);

		if (index === -1) {
			return;
		}

		this.data[index] = document;
	}

	public clear(): void {
		this.data = [];
		this.total = 0;
	}

	public async update(): Promise<void> {
		const documents = await this.documentRepository.fetchDocuments(
			this.data.length
		);

		this.total = documents.total;

		const data = documents.data
			.filter(
				(document: CouchResponse) =>
					!this.data.find(
						(d: CouchItem) =>
							(d as Document)._id === document.id &&
							(d as Document)._rev === document.value.rev
					)
			)
			.map(
				(document: CouchResponse) =>
					new Document(document, this.documentRepository.database!.id!)
			);

		this.data = this.data.concat(data);
	}
}
