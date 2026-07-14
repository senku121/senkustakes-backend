const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail({ to, subject, html }) {
    return await resend.emails.send({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html
    });
}

module.exports = { sendMail };