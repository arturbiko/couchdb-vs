import * as vscode from 'vscode';
import CouchItem from './provider/couch.item';
import { CouchDataProvider } from './provider/couch.provider';
import { extensionId } from './extension';
import CouchModel from './provider/couch.model';

export default class CouchExtension {
	private treeView?: vscode.TreeView<CouchItem>;

	activate(context: vscode.ExtensionContext) {
		const couchData = new CouchModel();
		couchData.fetchAll();

		const myTreeProvider = new CouchDataProvider(couchData);
		this.treeView = vscode.window.createTreeView(extensionId('couchDataView'), {
			treeDataProvider: myTreeProvider,
		});

		vscode.window.registerTreeDataProvider(
			extensionId('couchDataView'),
			myTreeProvider
		);

		vscode.commands.registerCommand(extensionId('refreshDatabases'), async () => {
			await couchData.fetchAll();
			myTreeProvider.refresh();
		});
	}
}
