import type { Request, Response, NextFunction } from "express";
import { getDb } from "./db.js";
import { MongoServerError } from "mongodb";
import type { Book } from "./types/book.js";


async function addBook(req: Request, res: Response) {
    if (!req.session.user) throw new Error("Not logged in");    // Should never happen with checkAuth required
    console.log("addBook called");
    console.log(req.body);
    if (req.body.seriesNumber && (typeof req.body.seriesNumber !== "number" || !Number.isFinite(req.body.seriesNumber)))
        return res.status(400).json({ error: "Invalid seriesNumber" });
    if (typeof req.body.rating !== "number" || req.body.rating > 100 || req.body.rating < 0)
        return res.status(400).json({ error: "Invalid rating" });

    const date: Date = new Date(req.body.year, req.body.month - 1, req.body.day);
    if (isNaN(date.getTime())) 
        return res.status(400).json({ error: "Invalid date" });

    const book: Book = {
        userId: req.session.user.id,
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        series: req.body.series,
        seriesNumber: req.body.seriesNumber,
        rating: req.body.rating,
        date: date,
        review: req.body.review
    }
    console.log(book);
    const db = await getDb();
    try {
        const newBook = await db.collection("books").insertOne(book);
        res.status(201).json({ message: "Book added successfully" });
    }
    catch (err){
        console.log(err);
        return res.status(500).json({ error: "Error adding book" });
    }
}   

export { addBook }