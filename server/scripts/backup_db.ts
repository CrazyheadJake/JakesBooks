import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { User } from "../src/types/user.js";
import { Book } from "../src/types/book.js";
dotenv.config();

const uri = process.env.MONGO_URI!;
console.log("MONGO_URI:", process.env.MONGO_URI);
const client = new MongoClient(uri);

await client.connect();
const sourceDb = client.db("test");
const targetDb = client.db("backup");

const users = await sourceDb.collection("user").find().toArray();
const books = await sourceDb.collection("book_entry").find().toArray();

await targetDb.collection("users").insertMany(users);
await targetDb.collection("books").insertMany(books);


await client.close();