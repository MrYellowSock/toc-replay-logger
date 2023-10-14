import { MongoClient } from 'mongodb';
import { initApp } from './server.mjs';
// configurations
const port = process.env.PORT ?? 3000;
const mongoUrl = process.env.MONGO_URL ?? 'mongodb://localhost:27017/snake';
const staticDir = process.env.STATIC_DIR ?? './public';
console.log(`MongoDB URL: ${mongoUrl}`);
console.log(`Static directory: ${staticDir} port: ${port}`);

const mongoClient = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
initApp(mongoClient, port, staticDir);
