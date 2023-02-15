const express = require('express');
const cors =require('cors');


require('dotenv').config();
const connectToMongo = require("./db")
connectToMongo();

let port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/auth',require('./routes/auth'));





app.listen(port, ()=>
 console.log(`Server listening at port ${port}`));