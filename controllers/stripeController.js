const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const UserModel = require("../Models/User");


const endpointSecret =process.env.WEBHOOK_SECRET;
const handleSuccessPayment = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
        console.log('err ror ',err)
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const session = event.data.object;
    const userId = session.client_reference_id;
    console.log('session',session)
    console.log("userId",userId)
    switch (event.type) {
        case 'checkout.session.completed':
          const sessionData = event.data.object;
          const userId = sessionData.metadata.userId;
          console.log(`User ID: ${userId}`);
          await UserModel.findByIdAndUpdate(userId, { $set: { isPremium: true } });
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
  } catch (error) {
    console.error("Error handling webhook:", error);
    return res.status(400).send("Webhook error");
  }
  res.json({ received: true });
};

module.exports = {
    handleSuccessPayment,
  };
  