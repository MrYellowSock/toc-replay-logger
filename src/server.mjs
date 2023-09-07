// imports
import cors from 'cors';
import express from 'express';
import { validateRoomCreation, validateRoomRead, validateRoomUpdate } from './schemas.mjs';
import { MongoClient } from 'mongodb';

/**
	@param {MongoClient} mongoClient
	@param {number} port
*/
export async function initApp(mongoClient, port) {
	// drivers
	const app = express();
	const db = mongoClient.db('snake');
	const collectionReplay = db.collection('replay');
	await collectionReplay.createIndex({ roomId: 1 }, { unique: true });

	//use json
	app.use(express.json());

	// allow cross origin requests
	app.use(cors())

	//use static files
	app.use(express.static('./public'));
	app.post('/replay/create', async (req, res) => {
		const latestRoom = await collectionReplay.find().sort({ roomId: -1 }).limit(1).toArray();
		const newRoomId = (latestRoom[0]?.roomId ?? 0) + 1;
		const creation = {
			...req.body,
			startedAt: new Date().toISOString(),
			roomId: newRoomId,
		};
		const roomValidation = validateRoomCreation(creation);
		if (!roomValidation) {
			return res.status(400).json({ error: validateRoomCreation.errors });
		}
		try {
			await collectionReplay.insertOne(creation);
			res.json(creation);
		}
		catch (err) {
			res.status(500).json({ error: err.message });
		}
	});

	app.put('/replay/progress/:roomId', async (req, res) => {
		const { roomId } = req.params;
		const update = {
			...req.body,
			roomId: parseInt(roomId),
		}
		const roomValidation = validateRoomUpdate(update);
		if (!roomValidation) {
			return res.status(400).json({ error: validateRoomUpdate.errors });
		}
		try {
			await collectionReplay.updateOne({ roomId: parseInt(roomId) }, { $set: update });
			res.status(200).end();
		}
		catch (err) {
			res.status(500).json({ error: err.message });
		}

	});

	app.get('/replay/progress', async (req, res) => {
		const { limit, offset } = req.query;
		const readParam = {
			limit: parseInt(limit ?? 10),
			offset: parseInt(offset ?? 0),
		}

		const roomValidation = validateRoomRead(readParam);
		if (!roomValidation) {
			return res.status(400).json({ error: validateRoomRead.errors });
		}
		else {
			const result = await collectionReplay.find().skip(readParam.offset).limit(readParam.limit).toArray();
			return res.json(result);
		}
	});
	app.get('/replay/progress/:roomId', async (req, res) => {
		const { roomId } = req.params;
		// validate
		const roomValidation = validateRoomRead(req.params);
		if (!roomValidation) {
			return res.status(400).json({ error: validateRoomRead.errors });
		}

		let result = await collectionReplay.findOne({ roomId: parseInt(roomId) })
		if (!result) {
			return res.status(404).json({ error: 'Room not found' });
		}
		else {
			return res.json(result);
		}
	});
	const server = app.listen(port, () => {
		console.log(`Server started at http://localhost:${port}`);
	});
	return { app, server };
}
