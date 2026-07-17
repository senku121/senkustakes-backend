/*==================================================
                SENKU PAY
        ADMIN DASHBOARD CONTROLLER
==================================================*/

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


/*==================================
              DASHBOARD
==================================*/

exports.getDashboard = async (req, res) => {

    try {

        const [

            totalUsers,

            totalAgents,

            totalTransactions,

            admin,

            pendingWithdraw,

            completedDeposits,

            completedWithdraws

        ] = await Promise.all([


            /* Total registered users */

            prisma.user.count(),


            /* Total registered agents */

            prisma.agent.count(),


            /* Total transactions */

            prisma.transaction.count(),


            /* Real platform/admin balance */

            prisma.admin.findFirst({

                where: {

                    status: "ACTIVE"

                },

                select: {

                    balance: true

                }

            }),


            /* Pending user withdrawal total */

            prisma.withdrawRequest.aggregate({

                _sum: {

                    amount: true

                },

                where: {

                    status: "Pending"

                }

            }),


            /* Completed deposit total */

            prisma.transaction.aggregate({

                _sum: {

                    amount: true

                },

                where: {

                    type: "Deposit",

                    status: "Completed"

                }

            }),


            /* Completed withdrawal total */

            prisma.transaction.aggregate({

                _sum: {

                    amount: true

                },

                where: {

                    type: "Withdraw",

                    status: "Completed"

                }

            })

        ]);


        /*
         * Dashboard balance now comes directly
         * from the Admin table.
         */

        const totalBalance =
            Number(admin?.balance || 0);


        return res.status(200).json({

            success: true,

            dashboard: {

                totalUsers,

                totalAgents,

                totalTransactions,

                totalBalance,

                pendingWithdraw:

                    Number(
                        pendingWithdraw._sum.amount || 0
                    ),

                totalDeposits:

                    Number(
                        completedDeposits._sum.amount || 0
                    ),

                totalWithdraws:

                    Number(
                        completedWithdraws._sum.amount || 0
                    )

            }

        });

    }

    catch (error) {

        console.error(

            "Dashboard error:",

            error

        );


        return res.status(500).json({

            success: false,

            message:

                "Unable to load dashboard."

        });

    }

};