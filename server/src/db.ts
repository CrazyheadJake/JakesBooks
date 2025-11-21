import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI!;
console.log("MONGO_URI:", process.env.MONGO_URI);
const client = new MongoClient(uri);

let connected = false;

export async function getDb() {
  if (!connected) {
    await client.connect();
    connected = true;
    client.db("jakesbooks-dev").dropCollection("users");
    await client.db("jakesbooks-dev").createCollection("users");
    await client.db("jakesbooks-dev").collection("users").createIndex({ email: 1 }, { unique: true });
    console.log("Connected to MongoDB");
  }
  return client.db("jakesbooks-dev");
}