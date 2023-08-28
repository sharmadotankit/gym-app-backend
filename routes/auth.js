const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

const authController = require('../controllers/authController');



// Endpoint to create a user =============================================================================
router.post('/create-user',[
    body('name','Name must be at least 3 characters').isLength({ min: 3 }),
    body('email','Email must be a valid email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 }),
],authController.createUser);

//Endpoint to login a user /no login -required==============================================================
router.post('/login',authController.login)

//Endpoint to get a user /login required========================================================================
router.get('/getuser',fetchuser,authController.getUser);
router.get('/forgot-password')


module.exports = router;