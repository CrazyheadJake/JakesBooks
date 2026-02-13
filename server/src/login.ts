import type { Request, Response, NextFunction } from "express";
import { getDb } from "./db.js";
import { get } from "http";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { MongoServerError } from "mongodb";
import * as Email from "./email.js";
import type { User } from "./types/user.js";

async function hashPassword(password: string) {
    const saltRounds = 10;
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

function checkAuth(req: Request, res: Response) {
    console.log("checkAuth called: ", req.session, req.session?.user);
    if (req.session?.user) {
        res.status(200).json({ user: req.session.user, loggedIn: true });
    }
    else {
        res.status(401).json({ error: "Not logged in", loggedIn: false });
    }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not logged in" });
    }
    next();
}

async function login(req: Request, res: Response) {
    const { username, password } = req.body;
    const db = await getDb();
    console.log("username:", username);
    console.log("password:", password);

    const user = await db.collection("users").findOne({ email: username });
    console.log("DB user:", user);
    console.log("DB password:", password);
    if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    req.session.user = { id: user._id, username: username };
    res.status(200).json({ message: "Logged in successfully" });
}

async function signup(req: Request, res: Response) {
    console.log("signup called");
    const { name, email, password } = req.body;
    const db = await getDb();
    const hash = await hashPassword(password);
    if (!hash) return res.status(500).json({ error: "Error hashing password" });
    try {
        const newUser = await db.collection("users").insertOne({
            firstName: name,
            email: email,
            password: hash,
        });
        const user = await db.collection("users").findOne({ email: email });
        if (user == null) throw new Error("User not found");
        req.session.user = { id: user._id, username: email };
        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        if (err instanceof MongoServerError && err.code === 11000) {
            return res.status(500).json({ error: "Email already exists" });
        }
        else {
            console.log(err);
            return res.status(500).json({ error: "Error creating user" });
        }
    }
}

function logout(req: Request, res: Response) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Error logging out" });
        }
        res.status(200).json({ message: "Logged out successfully" });
    });
}

async function requestPasswordReset(req: Request, res: Response) {
    const { email } = req.body;
    const db = await getDb();
    const user = await db.collection("users").findOne({ email: email });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    console.log("Requesting password reset for user:", user);
    const emailres = await Email.sendPasswordResetEmail(email, user as User);
    console.log("Email result:", emailres);
    if (emailres.success) {
        return res.status(200).json({ message: "Password reset email succesfully sent to " + email})
    }
    else {
        return res.status(500).json({ error: "Error sending email" });
    }
}

async function resetPassword(req: Request, res: Response) {
    const { email, password } = req.body;
    const db = await getDb();
    const hash = await hashPassword(password);
    if (!hash) return res.status(500).json({ error: "Error hashing password" });
    try {
        const result = await db.collection("users").updateOne(
            { email: email },
            { $set: { password: hash } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const user = await db.collection("users").findOne({email: email});
        if (user) {
            Email.invalidateToken(user as User);
            req.session.user = { id: user._id, username: email };
        }

        return res.status(200).json({ message: "Password reset successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error resetting password" });
    }
}

export { checkAuth, requireAuth, login, logout, signup, resetPassword, requestPasswordReset };