const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

/*==============================
        GET ALL AGENTS
==============================*/

exports.getAgents = async (req, res) => {

    try {

        const agents = await prisma.agent.findMany({

            orderBy: {
                createdAt: "desc"
            }

        });

        res.json(agents);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

};


/*==============================
        CREATE AGENT
==============================*/

exports.createAgent = async (req, res) => {

    try {

        const {

    username,
    password,
    name,
    role

} = req.body;

        const exists = await prisma.agent.findUnique({

            where: {
                username
            }

        });

        if (exists) {

            return res.status(400).json({

                message: "Username already exists"

            });

        }

        const hashedPassword =
            await bcrypt.hash(password,10);

        await prisma.agent.create({

            data:{

    username,

    password:hashedPassword,

    name,

    role: role || "AGENT",

    balance:0,

    status:"ACTIVE"

}

        });

        res.json({

            message:"Agent created successfully"

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Server error"

        });

    }

};


/*==============================
        FREEZE / UNFREEZE
==============================*/

exports.toggleAgentStatus = async (req,res)=>{

    try{

        const { id } = req.params;

        const agent =
        await prisma.agent.findUnique({

            where:{ id }

        });

        if(!agent){

            return res.status(404).json({

                message:"Agent not found"

            });

        }

        const newStatus =

            agent.status==="ACTIVE"

            ? "FROZEN"

            : "ACTIVE";

        await prisma.agent.update({

            where:{ id },

            data:{
                status:newStatus
            }

        });

        res.json({

            message:"Status updated"

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Server error"

        });

    }

};