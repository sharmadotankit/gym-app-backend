const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

let port = process.env.PORT;


app.listen(port, ()=> console.log(`Server listening at port ${port}`));