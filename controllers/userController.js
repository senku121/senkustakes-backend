const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {

    try {

        const user = await prisma.user.findUnique({

            where: {
                id: req.user.id
            }

        });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json({

            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,

            balance: user.balance,
            deposited: user.deposited,
            withdrawn: user.withdrawn,
            lockedBalance: user.lockedBalance,

            status: user.status

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};