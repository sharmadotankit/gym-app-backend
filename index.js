const express = require('express');
const bodyParser = require('body-parser');
const cors =require('cors');
require("dotenv").config();
const app = express();

const stripeRoute =  require('./routes/stripeRoute');

app.use(cors());
app.use('/stripe', stripeRoute);
app.use(express.json());
app.use(bodyParser.json())

const connectToMongo = require("./db")
connectToMongo();

const commanRoute = require('./routes/commonRoute')
const authRoute = require('./routes/auth');
const userRoute = require('./routes/userRoute');

let port = process.env.PORT;



app.use('/api/auth',authRoute);
app.use('/comman', commanRoute);
app.use('/', userRoute);




app.listen(port, ()=>
 console.log(`Server listening at port ${port}`));