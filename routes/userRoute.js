const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");


router.post('/payment-success',userController.handleSuccessPayment)

module.exports = router;