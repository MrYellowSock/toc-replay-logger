import { expect, test } from '@jest/globals';
import request from 'supertest';
import { MongoClient } from 'mongodb';
import { initApp } from '../server.mjs';
import { MongoMemoryServer } from 'mongodb-memory-server';

var mongoMem, mongoClient, app, server;
describe('Good Home Routes', function() {
	beforeAll(async () => {
		mongoMem = new MongoMemoryServer()
		await mongoMem.start()

		var mongoUrl = mongoMem.getUri();
		mongoClient = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });

		var mainRoute = await initApp(mongoClient, 4444);
		app = mainRoute.app;
		server = mainRoute.server;
	});
	test('responds to /', async () => {
		const res = await request(app).get('/');
		expect(res.statusCode).toBe(200);
		expect(res.text.includes("GAME")).toBe(true);
	});
	test('creating room sequentially /replay/create', async () => {
		for (var i = 1; i <= 10; i++) {
			const res = await request(app).post('/replay/create').send({
				"users": [{ name: "red" }, { name: "blue" }],
				"gameMap": { name: "MAP69" },
			});
			expect(res.statusCode).toBe(200);
			expect(res.body.roomId).toBe(i);
		}
	});
	test('reading room /replay/progress/id', async () => {
		for (var i = 1; i <= 10; i++) {
			const res = await request(app).get(`/replay/progress/${i}`);
			expect(res.statusCode).toBe(200);
			expect(res.body.roomId).toBe(i);
		}
	});
	test('updating room /replay/progress/id', async () => {
		for (var i = 1; i <= 10; i++) {
			const res = await request(app).put(`/replay/progress/${i}`).send({
				"progress": "ABC"
			});
			expect(res.statusCode).toBe(200);
		}
	});
	test('reading room with progress /replay/progress/id', async () => {
		for (var i = 1; i <= 10; i++) {
			const res = await request(app).get(`/replay/progress/${i}`);
			expect(res.statusCode).toBe(200);
			expect(res.body.roomId).toBe(i);
			expect(res.body.progress).toBe("ABC");
		}
	});

	//simple test for demonstration
	test('simple creating room /replay/create', async () => {
		const res = await request(app).post('/replay/create').send({
			"users": [{ name: "sad" }, { name: "bad" }],
			"gameMap": { name: "MAP69" },
		});
		expect(res.statusCode).toBe(200);
		expect(res.body.roomId).toBeGreaterThanOrEqual(0);
		console.log(res.body);
	});
	test('simple updating room /replay/progress/id', async () => {
		const res = await request(app).put(`/replay/progress/${4}`).send({
			"progress": "ABC"
		});
		expect(res.statusCode).toBe(200);
		console.log(res.body);
	});
	test('simple reading room /replay/progress/id', async () => {
		const res = await request(app).get(`/replay/progress/${4}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.roomId).toBe(4);
		expect(res.body.progress).toBe("ABC");
		console.log(res.body);
	});

	// read with pagination
	test('reading room with pagination /replay/progress', async () => {
		const res = await request(app).get(`/replay/progress?limit=5&offset=5`);
		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(5);
	});

	afterAll(async () => {
		await mongoMem.stop();
		await mongoClient.close();
		server.close();
	});
});
