import * as vscode from 'vscode';
import nano = require('nano');
import { extensionId } from '../extension';

interface ConnectionSettings {
	protocol: string;
	host: string;
	username: string;
	password: string;
}

export default class ConnectionService {
	private settings: ConnectionSettings | undefined;

	public constructor() {
		this.writeSettings();
		this.onConfigurationChange();
	}

	public async instance(): Promise<nano.ServerScope> {
		return await this.connect();
	}

	private async onConfigurationChange(): Promise<void> {
		vscode.workspace.onDidChangeConfiguration(async (event) => {
			if (!event.affectsConfiguration(extensionId())) {
				return;
			}

			this.writeSettings();
		});
	}

	private writeSettings(): void {
		const config = vscode.workspace.getConfiguration(extensionId());
		const protocol = config.get<string>('protocol');
		const host = config.get<string>('host');
		const username = config.get<string>('username');
		const password = config.get<string>('password');

		if (!host || !username || !password || !protocol) {
			this.settings = undefined;

			throw new Error('Missing connection settings.');
		}

		this.settings = {
			protocol,
			host,
			username,
			password,
		};
	}

	private async connect(): Promise<nano.ServerScope> {
		if (!this.settings) {
			throw new Error('Missing connection settings.');
		}

		const connectionUrl = `${this.settings.protocol}://${this.settings.username}:${this.settings.password}@${this.settings.host}`;

		const connection = nano(connectionUrl);

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
