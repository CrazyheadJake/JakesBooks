import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;
console.log("MONGO_URI:", process.env.MONGO_URI);
const client = new MongoClient(uri);

async function resetDb() {
    await client.connect();
    await client.db("jakesbooks-dev").dropCollection("users");
    await client.db("jakesbooks-dev").createCollection("users");
    await client.db("jakesbooks-dev").collection("users").createIndex({ email: 1 }, { unique: true });
    await client.db("jakesbooks-dev").dropCollection("books");
    await client.db("jakesbooks-dev").createCollection("books");
    await client.db("jakesbooks-dev").collection("books").createIndex({ userId: 1 }, { unique: false });
    client.close();
}

resetDb();
