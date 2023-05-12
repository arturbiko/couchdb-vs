import * as vscode from 'vscode';
import { assert } from 'chai';
import Sinon = require('sinon');
import ConnectionService from '../../service/connection.service';
import CouchModel from '../../provider/couch.model';

describe('Test fetching of databases', () => {
	let connection: ConnectionService | undefined;
	before(() => {
		const settings = {
			get: (setting: string) => setting,
		};
		Sinon.mock(vscode.workspace).expects('getConfiguration').returns(settings);
		connection = new ConnectionService();
	});

	it('Return empty set of databases.', () => {
		const couch = new CouchModel(connection!);
		const databases = couch.listDatabases();
		assert.lengthOf(databases, 0);
	});
});
