import { MongoMemoryServer } from 'mongodb-memory-server';

export async function createMongoMemoryServerUrl() {
	let server = new MongoMemoryServer()
	await server.start()
	return server.getUri()
}
