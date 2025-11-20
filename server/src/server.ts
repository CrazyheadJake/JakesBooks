import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import cors from "cors";
import * as login from "./login.js";
import type { Request, Response } from "express";

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

app.post("/api/login", login.login);
app.post("/api/logout", login.requireAuth, login.logout);

app.listen(3001, () => console.log("Server running on port 3001"));