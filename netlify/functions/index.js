const express = require('express');
const cors =require('cors');
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors())


const connectToMongo = require("../../db")
connectToMongo();

const commanRoute = require('../../routes/commonRoute')
const authRoute = require('../../routes/auth')

let port = process.env.PORT;




app.use('/api/auth',authRoute);
app.use('/comman', commanRoute);



app.listen(port, ()=>
 console.log(`Server listening at port ${port}`));