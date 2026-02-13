import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DATABASE_NAME;
console.log("MONGO_URI:", process.env.MONGO_URI);
const client = new MongoClient(uri);

async function copyDb(oldDbName, newDbName) {
    await client.connect();
    const oldDb = client.db(oldDbName);
    const newDb = client.db(newDbName);
    const collections = await oldDb.listCollections().toArray();
    for (const collection of collections) {
        const oldCollection = oldDb.collection(collection.name);
        const newCollection = newDb.collection(collection.name);
        const documents = await oldCollection.find().toArray();
        await newCollection.insertMany(documents);
    }
    client.close();
}

async function resetDb(name = dbName) {
    await client.connect();
    await client.db(name).dropCollection("users");
    await client.db(name).createCollection("users");
    await client.db(name).collection("users").createIndex({ email: 1 }, { unique: true });
    await client.db(name).dropCollection("books");
    await client.db(name).createCollection("books");
    await client.db(name).collection("books").createIndex({ userId: 1 }, { unique: false });
    client.close();
}

// resetDb();
// copyDb("jakesbooks-dev", "production");