const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URL;
mongoose.set('strictQuery',true);

const connectToMongo=async()=>{
    await mongoose.connect(mongoURI,()=>{
       console.log("MongoDB connection success");
    })
}


module.exports = connectToMongo;