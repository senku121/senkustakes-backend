const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


exports.getWallet = async (req,res)=>{

    try{


        const user = await prisma.user.findUnique({

            where:{
                id:req.user.id
            },

            select:{

                username:true,

                email:true,

                firstName:true,

                lastName:true,

                balance:true,

                deposited:true,

                withdrawn:true,

                lockedBalance:true,

                status:true

            }

        });


        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }


        res.json(user);


    }
    catch(error){

        console.log(error);


        res.status(500).json({

            message:"Server error"

        });

    }

};