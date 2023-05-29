import * as vscode from 'vscode';
import DatabaseStore from 'src/core/database.store';
import { CouchDataProvider } from 'src/provider/couch.database.provider';

export default class DatabaseController {
	constructor(
		private readonly databaseStore: DatabaseStore,
		private readonly databaseView: CouchDataProvider
	) {}

	public async selectDatabse(name: string): Promise<void> {
		try {
			await this.databaseStore.update();

			const element = this.databaseStore.findByName(name);

			if (!element) {
				throw new Error('Database not available.');
			}

			this.databaseView.refresh();
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}
}
