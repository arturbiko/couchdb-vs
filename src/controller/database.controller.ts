import * as vscode from 'vscode';
import DatabaseStore from '../core/database.store';
import { CouchDataProvider } from '../provider/couch.database.provider';
import CouchItem from '../provider/couch.item';
import DocumentRepository from '../api/document.repository';

export default class DatabaseController {
	constructor(
		private readonly databaseStore: DatabaseStore,
		private readonly documentRepository: DocumentRepository,
		private readonly databaseProvider: CouchDataProvider,
		private readonly databaseView: vscode.TreeView<CouchItem>
	) {}

	public async refreshDatabases(): Promise<void> {
		try {
			await this.databaseStore.update();

			this.databaseProvider.refresh(this.databaseView);
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}

	public async selectDatabse(name: string): Promise<void> {
		try {
			await this.databaseStore.update();

			const element = this.databaseStore.findByName(name);

			if (!element) {
				throw new Error('Database not available.');
			}

			this.documentRepository.setActiveDatabase(element);

			this.databaseProvider.refresh(this.databaseView);
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}
}
