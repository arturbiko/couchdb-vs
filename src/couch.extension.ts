import * as vscode from 'vscode';
import CouchItem from './provider/couch.item';
import { CouchDataProvider } from './provider/couch.database.provider';
import { extensionId } from './extension';
import CouchModel from './provider/couch.model';
import { CouchDocumentProvider } from './provider/couch.document.provider';
import commands from './commands';
import ConnectionService from './service/connection.service';
export default class CouchExtension {
	private couch: CouchModel;

	constructor(private readonly context: vscode.ExtensionContext) {
		const connection = new ConnectionService();
		this.couch = new CouchModel(connection);
	}

	public async activate(): Promise<void> {
		const couchDataProvider = new CouchDataProvider(this.couch);
		const databaseView = vscode.window.createTreeView(
			extensionId('couchDataView'),
			{
				treeDataProvider: couchDataProvider,
			}
		);

		couchDataProvider.registerView(databaseView);

		this.context.subscriptions.push(
			vscode.window.registerTreeDataProvider(
				extensionId('couchDataView'),
				couchDataProvider
			)
		);

		const couchDocumentProvider = new CouchDocumentProvider(this.couch);
		const documentView = vscode.window.createTreeView(
			extensionId('couchDocumentList'),
			{
				treeDataProvider: couchDocumentProvider,
			}
		);

		couchDocumentProvider.registerView(documentView);

		this.context.subscriptions.push(
			vscode.window.registerTreeDataProvider(
				extensionId('couchDocumentList'),
				couchDocumentProvider
			)
		);

		commands(
			this.context,
			this.couch,
			couchDataProvider,
			couchDocumentProvider
		).forEach((command) => {
			this.context.subscriptions.push(
				vscode.commands.registerCommand(extensionId(command.id), (...args: any[]) =>
					command.fn(...args)
				)
			);
		});

		// TODO: move somewhere else
		try {
			await this.couch.fetchDatabases();
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}
}
