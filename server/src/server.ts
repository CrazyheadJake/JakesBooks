import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import cors from "cors";
import * as login from "./login.js";
import * as books from "./books.js";
import * as email from "./email.js";

const app = express();
app.use(cors()); // allow all origins (fine for dev)
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true } // no maxAge for indefinite session
    })
);

app.get("/api/checkAuth", login.checkAuth);
app.post("/api/login", login.login);
app.post("/api/signup", login.signup);
app.post("/api/logout", login.requireAuth, login.logout);
app.post("/api/addBook", login.requireAuth, books.validateBook, books.addBook);
app.put("/api/updateBook", login.requireAuth, books.validateBook, books.updateBook);
app.get("/api/getBooks", login.requireAuth, books.getBooks);
app.post("/api/deleteBook", login.requireAuth, books.deleteBook);
app.post("/api/resetPassword", email.validateResetToken, login.resetPassword);
app.post("/api/requestPasswordReset", login.requestPasswordReset);

app.listen(3001, () => console.log("Server running on port 3001"));