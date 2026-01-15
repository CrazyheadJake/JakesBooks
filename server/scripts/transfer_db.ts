import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { User } from "../src/types/user.js";
import { Book } from "../src/types/book.js";
dotenv.config();

const uri = process.env.MONGO_URI!;
console.log("MONGO_URI:", process.env.MONGO_URI);
const client = new MongoClient(uri);

const usersToTransfer = ["jake.d.moleski@gmail.com", "sam.d.moleski@gmail.com", "baconace14@hotmail.com"]
let userIds: ObjectId[] = [];

await client.connect();
const sourceDb = client.db("test");
const targetDb = client.db("jakesbooks-dev");

await transferUsers();
await transferBooks();


await client.close();

async function transferUsers() {
    const users = await sourceDb.collection("user").find().toArray();
    for (const user of users) {
        if (!usersToTransfer.includes(user.email)) {
            continue;
        }
        const newUser: User = {
            _id: user._id,
            email: user.email,
            firstName: user.first_name
        };
        userIds.push(user._id);
        const result = await targetDb.collection("users").insertOne(newUser);
        console.log(`Inserted user with _id: ${result.insertedId}`);
    }
}

async function transferBooks() {
    const books = await sourceDb.collection("book_entry").find().toArray();
    for (const book of books) {
        if (!userIds.find(id => id.equals(book.user_id))) {
            continue;
        }
        const newBook: Book = {
            _id: book._id,
            userId: book.user_id,
            cover: book.cover || "",
            title: book.title,
            author: book.author,
            genre: book.genre,
            series: book.series || "",
            seriesNumber: book.is_series ? book.num_in_series : undefined,
            rating: book.rating,
            date: book.date,
            review: book.review
        };
        const result = await targetDb.collection("books").insertOne(newBook);
        console.log(`Inserted book with _id: ${result.insertedId}`);
    }
}