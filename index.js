const express = require('express');
require('dotenv').config();
const connectToMongo = require("./db")
connectToMongo();

let port = process.env.PORT;
const app = express();
app.use(express.json());
app.use('/api/auth',require('./routes/auth'));




app.listen(port, ()=>
 console.log(`Server listening at port ${port}`));