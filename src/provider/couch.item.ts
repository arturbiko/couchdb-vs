import * as vscode from 'vscode';

export enum ViewType {
	PAGE,
	DOCUMENT,
	DATABASE,
	EMPTY,
}

export default abstract class CouchItem extends vscode.TreeItem {
	public abstract get type(): ViewType;
}
