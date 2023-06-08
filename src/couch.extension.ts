import * as vscode from 'vscode';
import { CouchDataProvider } from './provider/couch.database.provider';
import { extensionId } from './extension';
import CouchModel from './provider/couch.model';
import { CouchDocumentProvider } from './provider/couch.document.provider';
import commands from './commands';
import ConnectionService from './service/connection.service';
import DatabaseController from './controller/database.controller';
import DatabaseStore from './core/database.store';
import DatabaseRepository from './api/database.repository';
import DocumentController from './controller/document.controller';
import DocumentStore from './core/document.store';
import DocumentRepository from './api/document.repository';
export default class CouchExtension {
	private connection: ConnectionService;

	private couch: CouchModel;

	constructor(private readonly context: vscode.ExtensionContext) {
		this.connection = new ConnectionService();
		this.couch = new CouchModel(this.connection);
	}

	public async activate(): Promise<void> {
		// data layer (databases)
		const databaseProvider = new DatabaseRepository(this.connection);
		const databaseStore = new DatabaseStore(databaseProvider);

		// view layer (databases)
		const couchDataProvider = new CouchDataProvider(databaseStore);
		const databaseView = vscode.window.createTreeView(
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

		const databaseController = new DatabaseController(
			databaseStore,
			couchDataProvider,
			databaseView
		);

		// data layer (documents)
		const documentProvider = new DocumentRepository(this.connection);
		const documentStore = new DocumentStore(documentProvider);

		// view layer (documents)
		const couchDocumentProvider = new CouchDocumentProvider(this.couch);
		const documentView = vscode.window.createTreeView(
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

		const documentController = new DocumentController(
			documentStore,
			couchDocumentProvider,
			documentView
		);

		commands(
			this.context,
			this.couch,
			couchDataProvider,
			couchDocumentProvider,
			databaseController,
			documentController
		).forEach((command) =>
			this.context.subscriptions.push(
				vscode.commands.registerCommand(extensionId(command.id), (...args: any[]) =>
					command.fn(...args)
				)
			)
		);

		// TODO: move somewhere else
		try {
			await this.couch.fetchDatabases();
			couchDataProvider.refresh();
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}
}
