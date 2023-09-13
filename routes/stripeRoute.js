const express = require('express');
const router = express.Router();
const stripeController = require("../controllers/stripeController");
const bodyParser = require('body-parser');
router.use(bodyParser.raw({ type: 'application/json' }));

router.post('/handle-payment-success',stripeController.handleSuccessPayment)

module.exports = router;