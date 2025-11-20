import type { Request, Response, NextFunction } from "express";
import { getDb } from "./db.js";
import { get } from "http";
import crypto from "crypto";
import bcrypt from "bcrypt";

function storePassword(email: string, password: string) {
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      // Handle error
      console.error(err);
      return;
    }
    // Store the 'hash' in your database
    console.log('Hashed password:', hash);
    const db = await getDb();

    const user = await db.collection("users").insertOne({
      email: email,
      password: hash,
    });
    console.log("user:", user);
    });
}

function checkPasswordHash(password: string, stored: string) {
  const [method, salt, storedHash]: string[] = stored.split("$");
  if (method !== "sha256") return false;

  const hash = crypto
    .createHash("sha256")
    .update(salt + password, "utf-8")
    .digest("hex");
  console.log("hash:", hash);
  console.log("storedHash:", storedHash);
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash!, "hex")
  );
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  console.log("request received");
  const db = await getDb();

  const user = await db.collection("user").findOne({ email: username });
  console.log("user:", user);
  console.log("password:", password);
  if (user)
    console.log("checkPasswordHash(password, user.password):", checkPasswordHash(password, user.password));
  if (!user || !checkPasswordHash(password, user.password)) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  req.session.user = { username: username };
  res.status(200).json({ message: "Logged in successfully" });
}

function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
}

export { requireAuth, login, logout }