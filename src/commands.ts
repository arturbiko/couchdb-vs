import * as vscode from 'vscode';
import CouchModel from './provider/couch.model';
import { CouchDataProvider } from './provider/couch.database.provider';
import { CouchDocumentProvider } from './provider/couch.document.provider';
import { extensionId } from './extension';
import { Document } from './provider/couch.collection';
import EditorService from './service/editor.service';
import CouchItem from './provider/couch.item';

export interface Command {
	id: string;
	fn: (...args: any[]) => void;
}

export default function commands(
	context: vscode.ExtensionContext,
	couchData: CouchModel,
	databaseProvider: CouchDataProvider,
	documentProvider: CouchDocumentProvider,
	databaseView: vscode.TreeView<CouchItem>,
	documentView: vscode.TreeView<CouchItem>
): Command[] {
	const editorService = new EditorService(couchData, context);

	return [
		{
			id: 'refreshDatabases',
			fn: async () => {
				vscode.window.showInformationMessage('Fetching databases...');

				try {
					await couchData.fetchDatabases();

					databaseView.title = `Databases (${couchData.databaseCount})`;

					databaseProvider.refresh();
				} catch (error: any) {
					vscode.window.showErrorMessage(error.message);
				}
			},
		},
		{
			id: 'selectDatabase',
			fn: async (name: string) => {
				vscode.window.showInformationMessage('Fetching documents...');

				try {
					await couchData.fetchDocuments(name);
				} catch (error: any) {
					await couchData.fetchDatabases();

					databaseProvider.refresh();
				}

				databaseView.title = `Databases (${couchData.databaseCount})`;
				documentView.title = `Documents (${couchData.documentCount})`;

				documentProvider.refresh();
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
						await couchData.fetchDocuments(document.source);
					} else {
						document.setContent(JSON.stringify(data, null, '\t'));
						editorService.openDocument(document);
					}
				} catch (error: any) {
					await couchData.fetchDatabases();

					databaseProvider.refresh();
				}

				databaseView.title = `Databases (${couchData.databaseCount})`;
				documentView.title = `Documents (${couchData.documentCount})`;

				documentProvider.refresh();
			},
		},
	];
}
