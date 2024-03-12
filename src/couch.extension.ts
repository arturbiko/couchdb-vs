import * as vscode from 'vscode';
import { CouchDataProvider } from './provider/couch.database.provider';
import { extensionId } from './extension';
import { CouchDocumentProvider } from './provider/couch.document.provider';
import commands from './commands';
import ConnectionService from './service/connection.service';
import DatabaseController from './controller/database.controller';
import DatabaseStore from './core/database.store';
import DatabaseRepository from './api/database.repository';
import DocumentController from './controller/document.controller';
import DocumentStore from './core/document.store';
import DocumentRepository from './api/document.repository';
import EditorService from './service/editor.service';

export default class CouchExtension {
	private connection: ConnectionService;

	constructor(private readonly context: vscode.ExtensionContext) {
		this.connection = new ConnectionService();
	}

	public async activate(): Promise<void> {
		// data layer (databases)
		const databaseProvider = new DatabaseRepository(this.connection);
		const databaseStore = new DatabaseStore(databaseProvider);

		// data layer (documents)
		const documentProvider = new DocumentRepository(this.connection);
		const documentStore = new DocumentStore(documentProvider);

		// services
		const editorService = new EditorService(this.context, documentStore);

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
			documentProvider,
			couchDataProvider,
			databaseView
		);

		// view layer (documents)
		const couchDocumentProvider = new CouchDocumentProvider(documentStore);
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

		commands(databaseController, documentController).forEach((command) =>
			this.context.subscriptions.push(
				vscode.commands.registerCommand(extensionId(command.id), (...args: any[]) =>
					command.fn(...args)
				)
			)
		);

		// TODO: move somewhere else
		try {
			await databaseController.refreshDatabases();
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}
}
