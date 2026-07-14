const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getTransactions = async (req, res) => {

    try {

        const transactions = await prisma.transaction.findMany({

            where: {
                userId: req.user.id
            },

            orderBy: {
                createdAt: "desc"
            }

        });

        res.json(transactions);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};