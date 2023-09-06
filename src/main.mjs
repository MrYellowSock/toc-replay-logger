import { MongoClient } from 'mongodb';
import { initApp } from './server.mjs';
// configurations
const port = process.env.PORT ?? 4444;
const mongoUrl = process.env.MONGO_URL ?? 'mongodb://localhost:27017/snake';
console.log(`MongoDB URL: ${mongoUrl}`);

const mongoClient = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
initApp(mongoClient, port);
