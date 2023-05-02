import * as vscode from 'vscode';
import nano = require('nano');
import { extensionId } from '../extension';

export default class ConnectionService {
	private connection: nano.ServerScope | undefined;

	public constructor() {}

	public instance(): nano.ServerScope {
		if (!this.connection) {
			this.connection = this.connect();
		}

		return this.connection;
	}

	private connect(): nano.ServerScope {
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
