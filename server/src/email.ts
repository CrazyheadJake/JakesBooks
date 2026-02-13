import nodemailer from "nodemailer";
import type { Request, Response, NextFunction } from "express";
import type { User } from "./types/user.js";
import dotenv from "dotenv";
import { getDb } from "./db.js";
dotenv.config();
const CORS_ORIGIN = process.env.CORS_ORIGIN!;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

type EmailResult = {success: boolean, error?: string}
async function sendPasswordResetEmail(to: string, user: User): Promise<EmailResult> {
    const token = Math.random().toString(36).substring(2, 15);
    setResetToken(user.email, token);
    setTimeout(() => invalidateToken(user, token), 15 * 60 * 1000); // Invalidate token after 15 minutes
    const info = await transporter.sendMail({
        from: process.env.GOOGLE_APP_EMAIL,
        to,
        subject: "Jake's Books Password Reset",
        html: pswreset(user, new Date(), token),
    }).catch((err) => {
        console.log("Error sending email: ", err);
    });
    if (!info) {
        return { success: false, error: "Error sending email, try again later" };
    }
    if (info && info.rejected.length > 0) {
        return { success: false, error: info.rejected.join(", ") };
    } else {
        return { success: true };
    }
}

function pswreset(user: User, date: Date, resetToken: string) {
    const resetLink = `${CORS_ORIGIN}/reset-password?user=${encodeURIComponent(user.email)}&token=${encodeURIComponent(resetToken)}`;
    return (
    `<div>Dear ${user.firstName},
        <br/><br/>
        Thank you for contacting Jake's Books. We received a password reset request for your email address.
        <br/><br/>
        Please click this <a href="${resetLink}" target="_blank">link</a> to change your password for your Jake's Books account. This link will expire in 15 minutes.
        <br/><br/>
        Please do not reply to this email.
        <br/><br/>
        Sincerely,
        <br/><br/>
        Jake's Books
    </div>`);
}

async function validateResetToken(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const token = req.body.token;
    const db = await getDb();
    const resetToken = await db.collection("password_resets").findOne({ email, token });
    if (resetToken) {
        next();
    }
    else {
        return res.status(400).json({ error: "Invalid or expired reset token" });
    }
}

async function invalidateToken(user: User, token: string = "") {
    const db = await getDb();
    if (token) {
        await db.collection("password_resets").deleteOne({ email: user.email, token: token });
    }
    else {
        await db.collection("password_resets").deleteOne({ email: user.email });
    }
}

async function setResetToken(email: string, token: string) {
    const db = await getDb();
    await db.collection("password_resets").updateOne(
        { email },
        { $set: { token: token, createdAt: new Date() } },
        { upsert: true }
    );
}

export { sendPasswordResetEmail, validateResetToken, invalidateToken };