import * as vscode from 'vscode';
import nano = require('nano');
import { extensionId } from '@/extension';

export default class ConnectionService {
	private connection: nano.ServerScope | undefined;

	public constructor() {}

	public async instance(): Promise<nano.ServerScope> {
		if (!this.connection) {
			this.connection = await this.connect();
		}

		return this.connection;
	}

	private async connect(): Promise<nano.ServerScope> {
		const config = vscode.workspace.getConfiguration(extensionId());
		const protocol = config.get<string>('protocol');
		const host = config.get<string>('host');
		const username = config.get<string>('username');
		const password = config.get<string>('password');

		if (!host || !username || !password || !protocol) {
			throw new Error('Missing connection settings.');
		}

		const dbUrl = `${protocol}://${username}:${password}@${host}`;

		const connection = nano(dbUrl);

		try {
			await connection.info();
		} catch (error) {
			throw new Error(
				'Trouble accessing CouchDB. Check your connections settings and try again.'
			);
		}

		return connection;
	}
}
