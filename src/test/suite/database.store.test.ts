import { assert } from 'chai';
import Sinon = require('sinon');
import DatabaseStore from '../../core/database.store';
import DatabaseRepository from '../../api/database.repository';

describe('Store', () => {
	it('Fetch elements', async () => {
		const repository = Sinon.createStubInstance(DatabaseRepository);
		repository.fetchDatabases
			.onFirstCall()
			.resolves([])
			.onSecondCall()
			.resolves(['test1', 'test2'])
			.onThirdCall()
			.resolves(['test3', 'test4', 'test5']);
		const store = new DatabaseStore(repository);

		await store.update();
		assert(store.size() === 0, 'Store is not empty.');

		await store.update();
		assert(store.size() === 2, 'Store contains not 2 elements.');

		await store.update();
		assert(store.size() === 3, 'Store contains not 3 elements.');

		const data = store.list();

		assert(data[0].label === 'test3', 'Wrong database name.');
		assert(data[1].label === 'test4', 'Wrong database name.');
		assert(data[2].label === 'test5', 'Wrong database name.');
	});
});
