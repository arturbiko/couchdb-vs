import * as vscode from 'vscode';
import CouchItem from './provider/couch.item';
import { CouchDataProvider } from './provider/couch.database.provider';
import { extensionId } from './extension';
import CouchModel from './provider/couch.model';
import { CouchDocumentProvider } from './provider/couch.document.provider';

export default class CouchExtension {
	private databaseView?: vscode.TreeView<CouchItem>;

	private documentView?: vscode.TreeView<CouchItem>;

	activate(context: vscode.ExtensionContext) {
		const couchData = new CouchModel();
		couchData.fetchAll();

		const myTreeProvider = new CouchDataProvider(couchData);
		this.databaseView = vscode.window.createTreeView(
			extensionId('couchDataView'),
			{
				treeDataProvider: myTreeProvider,
			}
		);

		vscode.window.registerTreeDataProvider(
			extensionId('couchDataView'),
			myTreeProvider
		);

		const couchDocumentProvider = new CouchDocumentProvider(couchData);
		this.documentView = vscode.window.createTreeView(
			extensionId('couchDocumentList'),
			{
				treeDataProvider: couchDocumentProvider,
			}
		);

		vscode.window.registerTreeDataProvider(
			extensionId('couchDocumentList'),
			couchDocumentProvider
		);

		vscode.commands.registerCommand(extensionId('refreshDatabases'), async () => {
			await couchData.fetchAll();
			myTreeProvider.refresh();
		});

		vscode.commands.registerCommand(
			extensionId('selectDatabase'),
			async (name) => {
				await couchData.fetchDocuments(name);
				couchDocumentProvider.refresh();
			}
		);

		vscode.commands.registerCommand(extensionId('openSettings'), () => {
			vscode.commands.executeCommand(
				'workbench.action.openSettings',
				extensionId()
			);
		});
	}
}
