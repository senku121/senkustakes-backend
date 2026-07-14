const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/*================================
        GET ALL WITHDRAWALS
================================*/

exports.getAllWithdraws = async (req,res)=>{

    try{

        const withdrawals =
        await prisma.withdrawRequest.findMany({

            include:{

                user:{

                    select:{

                        id:true,
                        username:true,
                        email:true

                    }

                }

            },

            orderBy:{

                createdAt:"desc"

            }

        });

        res.json(withdrawals);

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Server error."

        });

    }

};
/*================================
        APPROVE WITHDRAW
================================*/

exports.approveWithdraw = async (req,res)=>{

    try{

        const { id } = req.params;

        const request =
        await prisma.withdrawRequest.findUnique({

            where:{ id }

        });

        if(!request){

            return res.status(404).json({

                message:"Withdrawal not found."

            });

        }

        if(request.status!=="Pending"){

            return res.status(400).json({

                message:"This withdrawal has already been processed."

            });

        }

        await prisma.user.update({

            where:{

                id:request.userId

            },

            data:{

                lockedBalance:{
                    decrement:request.amount
                },

                withdrawn:{
                    increment:request.amount
                }

            }

        });

        await prisma.withdrawRequest.update({

            where:{ id },

            data:{

                status:"Approved"

            }

        });

        await prisma.transaction.updateMany({

            where:{

                userId:request.userId,

                type:"Withdrawal",

                status:"Pending"

            },

            data:{

                status:"Approved"

            }

        });

        res.json({

            message:"Withdrawal approved."

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Server error."

        });

    }

};
/*================================
        REJECT WITHDRAW
================================*/

exports.rejectWithdraw = async (req,res)=>{

    try{

        const { id } = req.params;

        const request =
        await prisma.withdrawRequest.findUnique({

            where:{ id }

        });

        if(!request){

            return res.status(404).json({

                message:"Withdrawal not found."

            });

        }

        if(request.status!=="Pending"){

            return res.status(400).json({

                message:"This withdrawal has already been processed."

            });

        }

        await prisma.user.update({

            where:{

                id:request.userId

            },

            data:{

                balance:{
                    increment:request.amount
                },

                lockedBalance:{
                    decrement:request.amount
                }

            }

        });

        await prisma.withdrawRequest.update({

            where:{ id },

            data:{

                status:"Rejected"

            }

        });

        await prisma.transaction.updateMany({

            where:{

                userId:request.userId,

                type:"Withdrawal",

                status:"Pending"

            },

            data:{

                status:"Rejected"

            }

        });

        res.json({

            message:"Withdrawal rejected."

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Server error."

        });

    }

};