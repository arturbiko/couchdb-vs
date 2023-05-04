import * as vscode from 'vscode';
import CouchItem from '@provider/couch.item';
import { CouchDataProvider } from '@provider/couch.database.provider';
import { extensionId } from '@/extension';
import CouchModel from '@provider/couch.model';
import { CouchDocumentProvider } from '@provider/couch.document.provider';
import { Document } from '@provider/couch.collection';
import EditorService from '@service/editor.service';

export default class CouchExtension {
	private databaseView?: vscode.TreeView<CouchItem>;

	private documentView?: vscode.TreeView<CouchItem>;

	constructor(private readonly context: vscode.ExtensionContext) {}

	public activate(): void {
		const couchData = new CouchModel();

		const editorService = new EditorService(couchData, this.context);

		const couchDataProvider = new CouchDataProvider(couchData);
		this.databaseView = vscode.window.createTreeView(
			extensionId('couchDataView'),
			{
				treeDataProvider: couchDataProvider,
			}
		);

		couchData.fetchDatabases();

		this.addDisposable(
			vscode.window.registerTreeDataProvider(
				extensionId('couchDataView'),
				couchDataProvider
			)
		);

		const couchDocumentProvider = new CouchDocumentProvider(couchData);
		this.documentView = vscode.window.createTreeView(
			extensionId('couchDocumentList'),
			{
				treeDataProvider: couchDocumentProvider,
			}
		);

		this.addDisposable(
			vscode.window.registerTreeDataProvider(
				extensionId('couchDocumentList'),
				couchDocumentProvider
			)
		);

		this.addDisposable(
			vscode.commands.registerCommand(
				extensionId('refreshDatabases'),
				async () => {
					await couchData.fetchDatabases();
					couchDataProvider.refresh();
				}
			)
		);

		this.addDisposable(
			vscode.commands.registerCommand(
				extensionId('selectDatabase'),
				async (name) => {
					try {
						await couchData.fetchDocuments(name);
					} catch (error: any) {
						await couchData.fetchDatabases();

						vscode.window.showErrorMessage(error.message);
					}

					couchDataProvider.refresh();
				}
			)
		);

		this.addDisposable(
			vscode.commands.registerCommand(extensionId('openSettings'), () => {
				vscode.commands.executeCommand(
					'workbench.action.openSettings',
					extensionId()
				);
			})
		);

		this.addDisposable(
			vscode.commands.registerCommand(
				extensionId('openDocument'),
				(document: Document) => editorService.openDocument(document)
			)
		);
	}

	public addDisposable(disposable: vscode.Disposable): void {
		this.context.subscriptions.push(disposable);
	}
}
