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

(async () => {

    console.log("Checking SMTP...");

    try{

        await transporter.verify();

        console.log("SMTP READY");

    }

    catch(err){

        console.log("SMTP VERIFY FAILED");

        console.log(err);

    }

})();

module.exports = {
    sendMail: (options) => transporter.sendMail(options)
};
