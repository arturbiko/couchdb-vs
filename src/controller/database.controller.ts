import * as vscode from 'vscode';
import DatabaseStore from '../core/database.store';
import { CouchDataProvider } from '../provider/couch.database.provider';
import CouchItem from '../provider/couch.item';
import DocumentRepository from '../api/document.repository';
import { Database } from '../provider/couch.collection';
import {
	validateDatabaseName,
	validateDatabaseRemoveCondition,
} from '../service/validator.service';

export default class DatabaseController {
	constructor(
		private readonly databaseStore: DatabaseStore,
		private readonly documentRepository: DocumentRepository,
		private readonly databaseProvider: CouchDataProvider,
		private readonly databaseView: vscode.TreeView<CouchItem>
	) {}

	public async createDatabase(): Promise<void> {
		try {
			let valid = undefined;

			let name: string | undefined = '';

			while (!valid?.valid) {
				name = await vscode.window.showInputBox({
					placeHolder: 'Database name',
					prompt: 'Enter a unique database name',
				});

				// user bailed with esc
				if (name === undefined) {
					return;
				}

				valid = validateDatabaseName(name);

				if (!valid.valid) {
					vscode.window.showErrorMessage(valid.message || '');
				}
			}

			await this.databaseStore.create(name);

			await this.databaseProvider.refresh(this.databaseView);

			vscode.window.showInformationMessage(`Successfully created ${name}.`);
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}

	public async refreshDatabases(): Promise<void> {
		try {
			await this.databaseStore.update();

			this.databaseProvider.refresh(this.databaseView);
		} catch (error: any) {
			this.databaseProvider.refresh(this.databaseView, false);
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

	public async removeDatabase(database: Database): Promise<void> {
		try {
			let valid = undefined;

			const name: string | undefined = await vscode.window.showInputBox({
				placeHolder: database.label?.toString(),
				prompt: `Enter database name ${database.label?.toString()} to remove it. THIS ACTION IS NOT REVERSIBLE!`,
			});

			valid = validateDatabaseRemoveCondition(database.id, name);

			if (!valid.valid) {
				vscode.window.showErrorMessage(valid.message || '');

				return;
			}

			if (!name) {
				return;
			}

			await this.databaseStore.remove(database);

			this.documentRepository.setActiveDatabase(undefined);
			this.databaseProvider.refresh(this.databaseView);

			vscode.window.showInformationMessage(`Successfully removed ${name}.`);
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}
}
