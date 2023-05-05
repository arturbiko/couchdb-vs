import * as vscode from 'vscode';
import CouchModel from '@provider/couch.model';
import { CouchDataProvider } from '@provider/couch.database.provider';
import { CouchDocumentProvider } from '@provider/couch.document.provider';
import { extensionId } from './extension';
import { Document } from '@provider/couch.collection';
import EditorService from '@service/editor.service';

export interface Command {
	id: string;
	fn: Function;
}

export default function commands(
	context: vscode.ExtensionContext,
	couchData: CouchModel,
	databaseProvider: CouchDataProvider,
	documentProvier: CouchDocumentProvider
): Command[] {
	const editorService = new EditorService(couchData, context);

	return [
		{
			id: 'refreshDatabases',
			fn: async () => {
				await couchData.fetchDatabases();
				databaseProvider.refresh();
			},
		},
		{
			id: 'selectDatabase',
			fn: async (name: string) => {
				try {
					await couchData.fetchDocuments(name);
				} catch (error: any) {
					await couchData.fetchDatabases();
				}

				databaseProvider.refresh();
				documentProvier.refresh();
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
				}

				databaseProvider.refresh();
				documentProvier.refresh();
			},
		},
	];
}
