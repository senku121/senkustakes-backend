const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


/*================================
        GET ALL USERS
================================*/

exports.getUsers = async (req,res)=>{

    try{

        const users =
        await prisma.user.findMany({

            orderBy:{
                createdAt:"desc"
            },

            select:{

                id:true,
                username:true,
                email:true,

                balance:true,
                deposited:true,
                withdrawn:true,
                lockedBalance:true,

                status:true,

                createdAt:true

            }

        });


        res.json(users);


    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Server error"

        });

    }

};

/*================================
        ADD BALANCE
================================*/

exports.addBalance = async(req,res)=>{

try{

const {id}=req.params;

const {amount}=req.body;
const admin = await prisma.admin.findFirst();


if(!admin){

return res.status(404).json({
message:"Admin account not found"
});

}

if(admin.balance < Number(amount)){

return res.status(400).json({
message:"Insufficient platform balance"
});

}


const user = await prisma.user.findUnique({
    

where:{id}

});






if(!user){

return res.status(404).json({
message:"User not found"
});

}


await prisma.user.update({

where:{id},

data:{
balance:{
increment:Number(amount)
}
}

});

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


res.json({
message:"Balance added successfully"
});


}

catch(err){

console.log(err);

res.status(500).json({
message:"Server error"
});

}

};





/*================================
        DEDUCT BALANCE
================================*/


exports.deductBalance = async(req,res)=>{

try{

const {id}=req.params;

const {amount}=req.body;


const user = await prisma.user.findUnique({

where:{id}

});

if(!user){

return res.status(404).json({
message:"User not found"
});

}

if(user.balance < Number(amount)){

return res.status(400).json({
message:"User doesn't have enough balance"
});

}



let newBalance =
user.balance - Number(amount);



if(newBalance < 0)
newBalance=0;



await prisma.user.update({

where:{id},

data:{
    balance:newBalance
}

});


const admin = await prisma.admin.findFirst();

await prisma.admin.update({

where:{
id:admin.id
},

data:{
balance:{
increment:Number(amount)
}

}

});

res.json({
message:"Balance deducted successfully"
});


}

catch(err){

console.log(err);

res.status(500).json({
message:"Server error"
});

}

};





/*================================
        CHANGE STATUS
================================*/


exports.updateUserStatus = async(req,res)=>{

try{

const {id}=req.params;

const {status}=req.body;


const user = await prisma.user.findUnique({

where:{id}

});


if(!user){

return res.status(404).json({

message:"User not found"

});

}



await prisma.user.update({

where:{id},

data:{
status
}

});


res.json({

message:"User status updated"

});


}


catch(err){

console.log(err);

res.status(500).json({

message:"Server error"

});

}

};





/*================================
        RESET PASSWORD
================================*/


exports.resetPassword = async(req,res)=>{

try{


const bcrypt=require("bcrypt");


const {id}=req.params;

const {password}=req.body;



const hash =
await bcrypt.hash(password,10);



await prisma.user.update({

where:{id},

data:{
password:hash
}

});



res.json({

message:"Password reset successfully"

});


}


catch(err){

console.log(err);

res.status(500).json({

message:"Server error"

});

}


};





/*================================
        TRANSACTION HISTORY
================================*/


exports.getUserTransactions = async(req,res)=>{


try{


const transactions =
await prisma.transaction.findMany({

where:{
userId:req.params.id
},

orderBy:{
createdAt:"desc"
}

});


res.json(transactions);


}

catch(err){

console.log(err);


res.status(500).json({

message:"Server error"

});


}


};