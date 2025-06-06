const mongoose = require('mongoose');

const connectDb = async(req,res)=>{
    try{
        const connect = await mongoose.connect(process.env.Mongo_URL)
        console.log(`Database connected ${connect.connection.name}`);

    }catch(error){
        console.log(error);

    }
} 

module.exports=connectDb;