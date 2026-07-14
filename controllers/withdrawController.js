const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/*================================
        CREATE WITHDRAW
================================*/

exports.createWithdraw = async (req, res) => {

    try {

        const userId = req.user.id;

        const {

            amount,
            method,
            account

        } = req.body;

        if (!amount || amount <= 0) {

            return res.status(400).json({

                message: "Invalid withdrawal amount."

            });

        }

        const user = await prisma.user.findUnique({

            where: {

                id: userId

            }

        });

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        if (user.balance < amount) {

            return res.status(400).json({

                message: "Insufficient balance."

            });

        }

        await prisma.user.update({

            where: {

                id: userId

            },

            data: {

                balance: {

                    decrement: amount

                },

                lockedBalance: {

                    increment: amount

                }

            }

        });

        await prisma.withdrawRequest.create({

            data: {

                userId,

                amount,

                method,

                account,

                status: "Pending"

            }

        });

        await prisma.transaction.create({

            data: {

                userId,

                type: "Withdrawal",

                amount,

                status: "Pending"

            }

        });

        res.json({

            message: "Withdrawal request submitted."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server error."

        });

    }

};

/*================================
        GET USER WITHDRAWALS
================================*/

exports.getWithdraws = async (req, res) => {

    try {

        const withdrawals = await prisma.withdrawRequest.findMany({

            where: {

                userId: req.user.id

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        res.json(withdrawals);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server error."

        });

    }

};