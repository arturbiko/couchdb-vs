import * as vscode from 'vscode';
import CouchItem from './provider/couch.item';
import { CouchDataProvider } from './provider/couch.database.provider';
import { extensionId } from './extension';
import CouchModel from './provider/couch.model';
import { CouchDocumentProvider } from './provider/couch.document.provider';
import commands from './commands';
import ConnectionService from './service/connection.service';
export default class CouchExtension {
	private databaseView?: vscode.TreeView<CouchItem>;

	private documentView?: vscode.TreeView<CouchItem>;

	private couch: CouchModel;

	constructor(private readonly context: vscode.ExtensionContext) {
		const connection = new ConnectionService();
		this.couch = new CouchModel(connection);
	}

	public activate(): void {
		this.couch.fetchDatabases();

		const couchDataProvider = new CouchDataProvider(this.couch);
		this.databaseView = vscode.window.createTreeView(
			extensionId('couchDataView'),
			{
				treeDataProvider: couchDataProvider,
			}
		);

		this.context.subscriptions.push(
			vscode.window.registerTreeDataProvider(
				extensionId('couchDataView'),
				couchDataProvider
			)
		);

		const couchDocumentProvider = new CouchDocumentProvider(this.couch);
		this.documentView = vscode.window.createTreeView(
			extensionId('couchDocumentList'),
			{
				treeDataProvider: couchDocumentProvider,
			}
		);

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
			couchDocumentProvider,
			this.databaseView,
			this.documentView
		).forEach((command) => {
			this.context.subscriptions.push(
				vscode.commands.registerCommand(extensionId(command.id), (...args: any[]) =>
					command.fn(...args)
				)
			);
		});
	}
}
