// imports
import cors from 'cors';
import express from 'express';
import { MongoClient } from 'mongodb';
import { createMongoMemoryServerUrl } from './memgodb.mjs';
import { validateRoomCreation, validateRoomUpdate } from './schemas.mjs';

// configurations
const port = process.env.PORT ?? 4444;
const mongoUrl = process.env.MONGO_URL ?? await createMongoMemoryServerUrl();
console.log(`MongoDB URL: ${mongoUrl}`);

// drivers
const app = express();
const mongoClient = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
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
	const newRoomId = (latestRoom?.[0].roomId ?? 0) + 1;
	const creation = {
		...req.body,
		startedAt: new Date().toISOString(),
		status: 'started',
		roomId: newRoomId,
	};
	const roomValidation = validateRoomCreation(creation);
	if (!roomValidation) {
		return res.status(400).json({ error: validateRoomCreation.errors });
	}
	try {
		let insertResult = await collectionReplay.insertOne(creation);
		res.json(insertResult);
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

app.get('/replay/progress/:roomId', async (req, res) => {
	const { roomId } = req.params;
	let result = await collectionReplay.findOne({ roomId: parseInt(roomId) })
	if (!result) {
		return res.status(404).json({ error: 'Room not found' });
	}
	else {
		res.json(result);
	}
});
app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
