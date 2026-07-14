const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true",

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,

    logger: true,
    debug: true
});

transporter.verify((err) => {
    if (err) {
        console.log("SMTP VERIFY ERROR");
        console.log(err);
    } else {
        console.log("SMTP VERIFIED");
    }
});

module.exports = {
    sendMail: (options) => transporter.sendMail(options)
};