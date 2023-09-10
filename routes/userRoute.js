const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const checkIfUser = require('../utils/helper').checkIfUser;


router.post('/create-checkout-session',checkIfUser,userController.createCheckoutSession)
router.get('/get-user-data/:id',checkIfUser,userController.getUserData)

module.exports = router;