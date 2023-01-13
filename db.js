const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
mongoose.set('strictQuery',true);


const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
       console.log("mongoDB connection success");
    })
}


module.exports = connectToMongo;