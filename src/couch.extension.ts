import * as vscode from 'vscode';
import CouchRow from './provider/couch.item';
import { CouchDataProvider } from './provider/couch.provider';
import { extensionId } from './extension';

export default class CouchExtension {
	private treeView: vscode.TreeView<CouchRow>;

	activate(context: vscode.ExtensionContext) {
		const myTreeProvider = new CouchDataProvider();
		this.treeView = vscode.window.createTreeView(extensionId('couchDataView'), {
			treeDataProvider: myTreeProvider,
		});

		vscode.window.registerTreeDataProvider(
			extensionId('couchDataView'),
			myTreeProvider
		);

		const disposable = vscode.commands.registerCommand(
			extensionId('showTree'),
			() => {
				myTreeProvider.refresh();
				this.treeView.reveal(myTreeProvider.getChildren()[0]);
			}
		);

		context.subscriptions.push(disposable);
	}
}
