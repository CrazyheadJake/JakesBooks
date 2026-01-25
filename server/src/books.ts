import type { Request, Response, NextFunction } from "express";
import { getDb } from "./db.js";
import { MongoServerError, ObjectId } from "mongodb";
import type { Book } from "./types/book.js";
import { get } from "http";
import getCoverImageUrl from "./googlesearch.js";

function validateBook(req: Request, res: Response, next: NextFunction) {
    if (req.body.seriesNumber && (typeof req.body.seriesNumber !== "number" || !Number.isFinite(req.body.seriesNumber)))
        return res.status(400).json({ error: "Invalid seriesNumber" });
    if (typeof req.body.rating !== "number" || req.body.rating > 100 || req.body.rating < 0)
        return res.status(400).json({ error: "Invalid rating" });

    const date: Date = new Date(req.body.year, req.body.month - 1, req.body.day);
    if (isNaN(date.getTime())) 
        return res.status(400).json({ error: "Invalid date" });

    const book: Book = {
        userId: new ObjectId(req.session.user!.id),
        cover: "",
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        series: req.body.series,
        seriesNumber: req.body.seriesNumber,
        rating: req.body.rating,
        date: date,
        review: req.body.review
    };
    req.body.book = book;
    next();
}

async function addBook(req: Request, res: Response) {
    console.log("addBook called");
    const book: Book = req.body.book;
    book.cover = await getCoverImageUrl(book.title, book.author);
    console.log(book);
    const db = await getDb();
    try {
        const newBook = await db.collection("books").insertOne(book);
        return res.status(201).json({ message: "Book successfully added" });
    }
    catch (err){
        console.log(err);
        return res.status(500).json({ error: "There was an unexpected error while adding your book" });
    }
}   

async function updateBook(req: Request, res: Response) {
    const book: Book = req.body.book;
    if (!req.body.bookId) {
        return res.status(400).json({ error: "Missing bookId" });
    }
    const query = { _id: new ObjectId(req.body.bookId) };
    console.log("updateBook called: " + JSON.stringify(book) + " id: " + req.body.bookId);
    const db = await getDb();
    try {
        // Update cover image only if title or author changed
        const oldBook = await db.collection("books").findOne(query);
        if (oldBook) {
            if (oldBook.title !== book.title || oldBook.author !== book.author) {
                book.cover = await getCoverImageUrl(book.title, book.author);
            } else {
                book.cover = oldBook.cover;
            }
        }
        const updatedBook = await db.collection("books").updateOne(query, { $set: book });
        console.log(updatedBook);
        return res.status(200).json({ message: "Book updated successfully" });
    }
    catch (err){
        console.log(err);
        return res.status(500).json({ error: "Error updating book" });
    }
}

async function getBooks(req: Request, res: Response) {
    const db = await getDb();
    try {
        const books = await db.collection("books").find({ userId: new ObjectId(req.session.user!.id) }).toArray();
        return res.status(200).json(books);
    }
    catch (err){
        console.log(err);
        return res.status(500).json({ error: "Error getting books" });
    }
}

async function deleteBook(req: Request, res: Response) {
    const db = await getDb();
    if (!req.body.bookId) {
        return res.status(400).json({ error: "Missing bookId" });
    }
    const query = { _id: new ObjectId(req.body.bookId) };
    try {
        const deletedBook = await db.collection("books").deleteOne(query);
        console.log(deletedBook);
        return res.status(200).json({ message: "Book successfully deleted" });
    }
    catch (err){
        console.log(err);
        return res.status(500).json({ error: "There was an unexpected error while deleting your book" });
    }
}

export { addBook, getBooks, validateBook, updateBook, deleteBook };