const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/*================================
        GET ALL TRANSACTIONS
================================*/

exports.getAllTransactions = async (req, res) => {

    try {

        const transactions = await prisma.transaction.findMany({

            include: {

                user: {

                    select: {

                        id: true,
                        username: true,
                        email: true

                    }

                }

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        res.json(transactions);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server error"

        });

    }

};