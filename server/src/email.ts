import nodemailer from "nodemailer";

const PWResetsData: { [key: string]: string } = {};
const DEBUG = true;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

async function sendPasswordResetEmail(to: string, user: string) {
    PWResetsData[user] = Math.random().toString(36).substring(2, 15);
    await transporter.sendMail({
        from: process.env.GOOGLE_APP_EMAIL,
        to,
        subject: "Jake's Books Password Reset",
        text: pswreset(user, new Date(), PWResetsData[user]),
    });
}

function pswreset(user: string, date: Date, resetToken: string) {
    let resetLink = `https://jakesbooks.com/reset-password?user=${encodeURIComponent(user)}&token=${encodeURIComponent(resetToken)}`;
    if (DEBUG) {
        resetLink = "http://localhost:5173/reset-password?user=" + encodeURIComponent(user) + "&token=" + encodeURIComponent(resetToken);
    }
    return (
    `<div>Dear ${user},
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

export { sendPasswordResetEmail }