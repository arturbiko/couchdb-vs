import * as vscode from 'vscode';
import CouchItem from './couch.item';
import nano = require('nano');
import { extensionId } from '../extension';
import { Page, Row } from './couch.collection';

export const PAGE_SIZE = 10;

export class CouchDataProvider implements vscode.TreeDataProvider<CouchItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<CouchItem | undefined> =
		new vscode.EventEmitter<CouchItem | undefined>();

	readonly onDidChangeTreeData: vscode.Event<CouchItem | undefined> =
		this._onDidChangeTreeData.event;

	getTreeItem(element: CouchItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: CouchItem): Promise<CouchItem[]> {
		try {
			const couch = this.getConnection();

			// initial call to the view
			if (!element) {
				const dbList = await couch.db.list();

				// bail early if little element size
				if (dbList.length <= PAGE_SIZE) {
					return dbList.map((name) => {
						return new Row(name, vscode.TreeItemCollapsibleState.None);
					});
				}

				// set up collections
				const pages: Page[] = [];

				let index = 0;
				let page = 0;
				let collection = null;
				for (const db of dbList) {
					if (index === PAGE_SIZE || !collection) {
						collection = new Page(
							`Page ${page + 1}`,
							page + 1 === 1
								? vscode.TreeItemCollapsibleState.Expanded
								: vscode.TreeItemCollapsibleState.Collapsed
						);

						index = 0;
						page += 1;

						pages.push(collection);
					}

					if (collection !== null) {
						collection.add(new Row(db, vscode.TreeItemCollapsibleState.None));
						++index;
					}
				}

				return pages;
			}

			if (element && element.isPage) {
				return (element as Page).list();
			}

			return [];
		} catch (error: any) {
			vscode.window.showErrorMessage(
				`Error connecting to CouchDB: ${error.message}`
			);
			return [];
		}
	}

	refresh(): void {
		// this._onDidChangeTreeData.fire();
	}

	private getConnection(): nano.ServerScope {
		const config = vscode.workspace.getConfiguration(extensionId());
		const host = config.get<string>('host');
		const username = config.get<string>('username');
		const password = config.get<string>('password');

		if (!host || !username || !password) {
			throw new Error('Missing connection settings.');
		}

		const dbUrl = `http://${username}:${password}@${host}`;
		return nano(dbUrl);
	}
}
