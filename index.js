const express = require('express');
require('dotenv').config();
const connectToMongo = require("./db")
connectToMongo();

const app = express();

let port = process.env.PORT;


app.listen(port, ()=> console.log(`Server listening at port ${port}`));