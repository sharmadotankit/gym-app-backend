const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JET = process.env.JWT_SECRET;
const authController = require('../controllers/authController');



// Endpoint to create a user =============================================================================
router.post('/create-user',[
    body('name','Name must be at least 3 characters').isLength({ min: 3 }),
    body('email','Email must be a valid email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 }),
],authController.createUser);

//Endpoint to login a user /no login -required==============================================================
router.post('/login',[
    body('email','Email must be a valid email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 }),
],authController.login)

//Endpoint to get a user /login required========================================================================
router.get('/getuser',fetchuser,authController.getUser)


module.exports = router;