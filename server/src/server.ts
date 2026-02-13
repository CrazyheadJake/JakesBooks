import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import * as login from "./login.js";
import * as books from "./books.js";
import * as email from "./email.js";

const app = express();
app.set("trust proxy", 1); // Trust Vercel proxy

const corsOptions = {
  origin: process.env.CORS_ORIGIN!, 
  credentials: true,
};
console.log("Cors origin:", process.env.CORS_ORIGIN);
const isProduction = process.env.NODE_ENV === "production";

app.use(cors(corsOptions));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ 
            mongoUrl: process.env.MONGO_URI!,
            dbName: process.env.DATABASE_NAME!,
            collectionName: "sessions"
        }),
        cookie: { 
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
         } // no maxAge for indefinite session
    })
);

app.get("/checkAuth", login.checkAuth);
app.post("/login", login.login);
app.post("/signup", login.signup);
app.post("/logout", login.requireAuth, login.logout);
app.post("/addBook", login.requireAuth, books.validateBook, books.addBook);
app.put("/updateBook", login.requireAuth, books.validateBook, books.updateBook);
app.get("/getBooks", login.requireAuth, books.getBooks);
app.post("/deleteBook", login.requireAuth, books.deleteBook);
app.post("/resetPassword", email.validateResetToken, login.resetPassword);
app.post("/requestPasswordReset", login.requestPasswordReset);

if (process.env.NODE_ENV === "development") {
    app.listen(3001, () => console.log("Server running on port 3001"));
}

export default app;