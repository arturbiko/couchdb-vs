import * as vscode from 'vscode';

export default abstract class CouchItem extends vscode.TreeItem {
	public isPage: boolean = false;
}
