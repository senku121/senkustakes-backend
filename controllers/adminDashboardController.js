const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


exports.getDashboard = async (req,res)=>{

    try{


        const totalUsers =
        await prisma.user.count();



        const users =
        await prisma.user.findMany({

            select:{
                balance:true
            }

        });



        const totalBalance =
        users.reduce(

            (sum,user)=>
            sum + user.balance,

            0

        );



        const pendingWithdraw =
        await prisma.withdrawRequest.aggregate({

            _sum:{
                amount:true
            },

            where:{
                status:"Pending"
            }

        });



        const depositsToday =
        await prisma.transaction.aggregate({

            _sum:{
                amount:true
            },

            where:{

                type:"Deposit",

                status:"Completed"

            }

        });



        res.json({

            totalUsers,

            totalBalance,

            pendingWithdraw:
            pendingWithdraw._sum.amount || 0,


            todayDeposits:
            depositsToday._sum.amount || 0

        });


    }


    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server error"

        });

    }

};