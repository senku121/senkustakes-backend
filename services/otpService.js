const { sendMail } = require("./mailService");


exports.sendOTPEmail = async(email, otp)=>{


await sendMail({

to: email,

subject:"Senku Stakes Email Verification OTP",

html:`

<h2>Welcome to Senku Stakes</h2>

<p>Your verification code is:</p>

<h1>${otp}</h1>

<p>This OTP expires in 10 minutes.</p>

`

});


};