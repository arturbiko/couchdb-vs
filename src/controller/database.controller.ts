import * as vscode from 'vscode';
import DatabaseStore from 'src/core/database.store';
import { CouchDataProvider } from 'src/provider/couch.database.provider';
import CouchItem from 'src/provider/couch.item';

export default class DatabaseController {
	constructor(
		private readonly databaseStore: DatabaseStore,
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

			this.databaseStore.setDatabase(element);

			this.databaseProvider.refresh(this.databaseView);
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}
}
