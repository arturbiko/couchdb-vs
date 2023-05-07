import { assert } from 'chai';
import ConnectionService from '../../service/connection.service';
import CouchModel from '../../provider/couch.model';

describe('Test fetching of databases', () => {
	const connection: ConnectionService = new ConnectionService();

	it('Return empty set of databases.', () => {
		const couch = new CouchModel(connection);

		const databases = couch.listDatabases();

		assert.lengthOf(databases, 0);
	});
});
