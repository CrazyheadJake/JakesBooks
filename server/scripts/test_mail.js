import nodemailer from "nodemailer";

// Create a test account automatically
const testAccount = await nodemailer.createTestAccount();

function pswreset(user, date) {
    return (
    `<div>Dear ${user},
        <br/><br/>
        Thank you for contacting Jake's Books. We received a change password request at ${date.toLocaleTimeString() + " on " + date.toLocaleDateString()}.
        <br/><br/>
        Please click this <a href="" target="_blank" data-saferedirecturl="">link</a> to change your password for your Jake's Books account.
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

// Create a transporter using the test account
const testTransporter = nodemailer.createTransport({
  host: testAccount.smtp.host,
  port: testAccount.smtp.port,
  secure: testAccount.smtp.secure,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

// Send a test email
const info = await testTransporter.sendMail({
  from: '"Test Sender" <test@example.com>',
  to: "recipient@example.com",
  subject: "Test Email",
  text: "This is a test email sent via Ethereal!",
  html: pswreset("Jacob Moleski", new Date()),
});

console.log("Message sent: %s", info.messageId);
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));