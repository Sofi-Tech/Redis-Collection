import type { RedisCollection } from '../src/index.js';

interface TestObject {
	toJSON(): string;
}

declare const collection: RedisCollection<TestObject>;
declare const newCollection: RedisCollection<TestObject, number>;

describe('default JSON serialize', () => {
	test('Return Value should have serialized type', () => {
		expectTypeOf(collection.get('')).resolves.toMatchTypeOf<string | undefined>();

		// eslint-disable-next-line @typescript-eslint/unbound-method
		expectTypeOf(collection.set).parameter(1).toMatchTypeOf<TestObject>();

		// @ts-expect-error - should be a string
		assertType<Promise<TestObject>>(collection.get(''));
	});
});

describe('custom serialize', () => {
	test('Return Value should have serialized type', () => {
		expectTypeOf(newCollection.get('')).resolves.toMatchTypeOf<number | undefined>();

		// eslint-disable-next-line @typescript-eslint/unbound-method
		expectTypeOf(newCollection.set).parameter(1).toMatchTypeOf<TestObject>();

		// @ts-expect-error - should be a number
		assertType<Promise<TestObject>>(newCollection.get(0));
	});
});
