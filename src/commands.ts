import * as vscode from 'vscode';
import CouchModel from './provider/couch.model';
import { CouchDataProvider } from './provider/couch.database.provider';
import { CouchDocumentProvider } from './provider/couch.document.provider';
import { extensionId } from './extension';
import { Database, Document } from './provider/couch.collection';
import EditorService from './service/editor.service';
import CouchItem from './provider/couch.item';
import {
	validateDatabaseName,
	validateDatabaseRemoveCondition,
} from './service/validator.service';
import DatabaseController from './controller/database.controller';
import DocumentController from './controller/document.controller';

export interface Command {
	id: string;
	fn: (...args: any[]) => void;
}

export default function commands(
	context: vscode.ExtensionContext,
	couchData: CouchModel,
	databaseProvider: CouchDataProvider,
	documentProvider: CouchDocumentProvider,
	databaseController: DatabaseController,
	documentController: DocumentController
): Command[] {
	const editorService = new EditorService(context);

	return [
		{
			id: 'refreshDatabases',
			fn: () => databaseController.refreshDatabases(),
		},
		{
			id: 'selectDatabase',
			fn: async (name: string) => {
				await databaseController.selectDatabse(name);
				documentController.clearData();
				await documentController.refreshDocuments();
			},
		},
		{
			id: 'loadDocuments',
			fn: async (name: string) => {
				await documentController.loadDocuments();
			},
		},
		{
			id: 'removeDocument',
			fn: async (item: CouchItem) => {
				await documentController.removeDocument(item as Document);
			},
		},
		{
			id: 'removeDatabase',
			fn: async (item: CouchItem) => {
				await databaseController.removeDatabase(item as Database);
				documentController.clearData();
			},
		},
		{
			id: 'addDatabase',
			fn: async () => {
				await databaseController.createDatabase();
			},
		},
		{
			id: 'openSettings',
			fn: async () => {
				vscode.commands.executeCommand(
					'workbench.action.openSettings',
					extensionId()
				);
			},
		},
		{
			id: 'openDocument',
			fn: async (document: Document) => {
				try {
					const data = await couchData.fetchDocument(document);

					if (data._deleted) {
						vscode.window.showErrorMessage('Document was removed.');
						await couchData.fetchDocuments();
					} else {
						document._rev = data._rev;
						document.setContent(JSON.stringify(data, null, '\t'));
						editorService.openDocument(document);
					}
				} catch (error: any) {
					await couchData.fetchDatabases();

					databaseProvider.refresh();
				}

				documentProvider.refresh();
			},
		},
		{
			id: 'copyItemName',
			fn: async (item: CouchItem) => {
				if (!item.label) {
					return;
				}

				const clipboardy = await import('clipboardy');

				clipboardy.default.writeSync(item.label.toString());

				vscode.window.showInformationMessage(`Copied to clipboard 📋`);
			},
		},
	];
}
