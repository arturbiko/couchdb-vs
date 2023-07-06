import * as vscode from 'vscode';
import { extensionId } from './extension';
import { Database, Document } from './provider/couch.collection';
import CouchItem from './provider/couch.item';
import DatabaseController from './controller/database.controller';
import DocumentController from './controller/document.controller';

export interface Command {
	id: string;
	fn: (...args: any[]) => void;
}

export default function commands(
	databaseController: DatabaseController,
	documentController: DocumentController
): Command[] {
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
			fn: async () => {
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
			fn: async (item: CouchItem, isConnected: boolean) => {
				await databaseController.removeDatabase(item as Database);
				documentController.clearData();
			},
		},
		{
			id: 'addDatabase',
			fn: async (isConnected: boolean) => {
				await databaseController.createDatabase(isConnected);
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
				documentController.openDocument(document);
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
