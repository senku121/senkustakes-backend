const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// CREATE DEPOSIT REQUEST

exports.createDeposit = async (req,res)=>{

    try{

        const { amount, method } = req.body;


        if(!amount || amount <= 0){

            return res.status(400).json({

                message:"Invalid amount"

            });

        }


        const deposit = await prisma.deposit.create({

            data:{

                userId:req.user.id,

                amount:Number(amount),

                method:method || "Manual",

                status:"PENDING"

            }

        });


        res.json({

            message:"Deposit request created",

            deposit

        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server error"

        });

    }

};



// GET USER DEPOSITS

exports.getDeposits = async(req,res)=>{

    try{


        const deposits = await prisma.deposit.findMany({

            where:{

                userId:req.user.id

            },

            orderBy:{

                createdAt:"desc"

            }

        });


        res.json(deposits);


    }
    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server error"

        });

    }

};
// COMPLETE DEPOSIT (TEST)

exports.completeDeposit = async (req,res)=>{

    try{

        const { depositId } = req.body;


        const deposit = await prisma.deposit.findUnique({

            where:{
                id:depositId
            }

        });


        if(!deposit){

            return res.status(404).json({

                message:"Deposit not found"

            });

        }



        if(deposit.status==="SUCCESS"){

            return res.status(400).json({

                message:"Deposit already completed"

            });

        }



        const user = await prisma.user.findUnique({

            where:{
                id:deposit.userId
            }

        });



        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }



        await prisma.user.update({

            where:{
                id:user.id
            },

            data:{

                balance:{
                    increment:deposit.amount
                },

                deposited:{
                    increment:deposit.amount
                }

            }

        });



        await prisma.deposit.update({

            where:{
                id:deposit.id
            },

            data:{

                status:"SUCCESS"

            }

        });



        await prisma.transaction.create({

            data:{

                userId:user.id,

                type:"Deposit",

                amount:deposit.amount,

                status:"Completed"

            }

        });



        res.json({

            message:"Deposit completed successfully"

        });



    }
    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server error"

        });

    }

};
