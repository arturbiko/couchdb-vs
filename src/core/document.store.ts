import * as vscode from 'vscode';
import { CouchResponse } from '../api/couch.interface';
import DataStore from '../api/data.interface';
import DocumentRepository from '../api/document.repository';
import { Document, Empty, Load } from '../provider/couch.collection';
import CouchItem from '../provider/couch.item';
import { DocumentGetResponse } from 'nano';

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

	public async get(document: Document): Promise<DocumentGetResponse> {
		return this.documentRepository.get(document);
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
		const index = this.data.findIndex((d) => d.id === document.id);

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
					new Document(
						document,
						this.documentRepository.database!.label,
						vscode.TreeItemCollapsibleState.None
					)
			);

		this.data = this.data.concat(data);
	}
}
