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
    console.log("Connected to MongoDB");
  }
  return client.db("jakesbooks-dev");
}