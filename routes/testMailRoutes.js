const express = require("express");

const router = express.Router();

const { sendMail } = require("../services/mailService");


router.get("/", async (req,res)=>{

    try{

        await sendMail({

            to: process.env.MAIL_USER,

            subject:"Senku Stakes Email Test",

            html:`
            <h2>Email Test Successful</h2>
            <p>Your email system is working.</p>
            `

        });


        res.json({
            success:true,
            message:"Email sent"
        });


    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            error:err.message
        });

    }

});


module.exports = router;