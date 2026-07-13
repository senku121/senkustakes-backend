const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/*================================
        GET PLATFORM DATA
================================*/

exports.getPlatformWithdraw = async (req, res) => {

    try {

        const admin = await prisma.admin.findFirst();

        if (!admin) {

            return res.status(404).json({

                message: "Admin not found."

            });

        }

        const history = await prisma.platformWithdraw.findMany({

            orderBy: {

                createdAt: "desc"

            }

        });

        const today = new Date();
        today.setHours(0,0,0,0);

        const todayWithdraw = history
            .filter(w => new Date(w.createdAt) >= today)
            .reduce((sum,w)=>sum+w.amount,0);

        const totalWithdraw = history.reduce(

            (sum,w)=>sum+w.amount,

            0

        );

        res.json({

            balance: admin.balance,

            todayWithdraw,

            totalWithdraw,

            history

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
        CREATE PLATFORM WITHDRAW
================================*/

exports.createPlatformWithdraw = async (req,res)=>{

    try{

        const {

            amount,
            method,
            destination,
            holder,
            note

        } = req.body;

        if(!amount || amount<=0){

            return res.status(400).json({

                message:"Invalid amount."

            });

        }

        const admin = await prisma.admin.findFirst();

        if(!admin){

            return res.status(404).json({

                message:"Admin not found."

            });

        }

        if(admin.balance < amount){

            return res.status(400).json({

                message:"Insufficient platform balance."

            });

        }

        await prisma.admin.update({

            where:{
                id:admin.id
            },

            data:{

                balance:{
                    decrement:Number(amount)
                }

            }

        });

        await prisma.platformWithdraw.create({

            data:{

                amount:Number(amount),

                method,

                destination,

                holder,

                note,

                status:"Completed"

            }

        });

        res.json({

            message:"Platform withdrawal completed."

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Server error."

        });

    }

};