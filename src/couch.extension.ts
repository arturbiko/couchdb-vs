import * as vscode from 'vscode';
import CouchItem from '@provider/couch.item';
import { CouchDataProvider } from '@provider/couch.database.provider';
import { extensionId } from '@/extension';
import CouchModel from '@provider/couch.model';
import { CouchDocumentProvider } from '@provider/couch.document.provider';
import { Document } from '@provider/couch.collection';
import EditorService from '@service/editor.service';
import commands from './commands';
export default class CouchExtension {
	private databaseView?: vscode.TreeView<CouchItem>;

	private documentView?: vscode.TreeView<CouchItem>;

	private couch: CouchModel;

	constructor(private readonly context: vscode.ExtensionContext) {
		this.couch = new CouchModel();
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
			couchDocumentProvider
		).forEach((command) => {
			this.context.subscriptions.push(
				vscode.commands.registerCommand(extensionId(command.id), (...args: any[]) =>
					command.fn(...args)
				)
			);
		});
	}
}
