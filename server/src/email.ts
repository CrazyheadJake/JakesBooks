import nodemailer from "nodemailer";
import type { Request, Response, NextFunction } from "express";
import type { User } from "./types/user.js";

const PWResetsData: { [key: string]: string } = {};
const DEBUG = true;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

type EmailResult = {success: boolean, error?: string}
async function sendPasswordResetEmail(to: string, user: User): Promise<EmailResult> {
    PWResetsData[user.email] = Math.random().toString(36).substring(2, 15);
    const info = await transporter.sendMail({
        from: process.env.GOOGLE_APP_EMAIL,
        to,
        subject: "Jake's Books Password Reset",
        html: pswreset(user, new Date(), PWResetsData[user.email]!),
    });
    if (info.rejected.length > 0) {
        return { success: false, error: info.rejected.join(", ") };
    } else {
        return { success: true };
    }
}

function pswreset(user: User, date: Date, resetToken: string) {
    let resetLink = `https://jakesbooks.vercel.app/reset-password?user=${encodeURIComponent(user.email)}&token=${encodeURIComponent(resetToken)}`;
    if (DEBUG) {
        resetLink = "http://localhost:5173/reset-password?user=" + encodeURIComponent(user.email) + "&token=" + encodeURIComponent(resetToken);
    }
    return (
    `<div>Dear ${user.firstName},
        <br/><br/>
        Thank you for contacting Jake's Books. We received a change password request at ${date.toLocaleTimeString() + " on " + date.toLocaleDateString()}.
        <br/><br/>
        Please click this <a href="${resetLink}" target="_blank">link</a> to change your password for your Jake's Books account.
        <br/><br/>
        Please do not reply to this email.
        <br/><br/>
        Thank you for being our customer.
        <br/><br/>
        Sincerely,
        <br/><br/>
        Jake's Books
    </div>`);
}

function validateResetToken(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const token = req.body.token;
    if (PWResetsData[email] === token) {
        next();
    }
    else {
        return res.status(400).json({ error: "Invalid or expired reset token" });
    }
}

function invalidateToken(user: User) {
    delete PWResetsData[user.email];
}

export { sendPasswordResetEmail, validateResetToken, invalidateToken };