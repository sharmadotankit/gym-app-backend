const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const UserModel = require("../Models/User");

const endpointSecret ="whsec_8707cfee38baec89038ac90b199c6a4e3e725a57e22abbe21a01bfd62b12e1ed"
const handleSuccessPayment = async (req, res) => {
  try {
    console.log('cma here from webhook')
    const signature = req.headers["stripe-signature"];
    const rawBody = req.body.toString('utf8');
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_PRIVATE_KEY
      );
    } catch (err) {
        console.log('err ror ',err)
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log("event.type",event)
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

const createCheckoutSession = async (req, res) => {
  try {
    const payload = req.body;
    let email = payload.data.userEmail;
    if (!email) {
      throw {
        message: "Required data not received.Please try again later.",
      };
    }
    const userResponse = await UserModel.findOne({ email: email });
    if (!userResponse) {
      throw {
        message: "User does not exists.",
      };
    }

    let paymentData = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Premium Membership :" + userResponse.name,
          },
          unit_amount: 9900,
        },
        quantity: 1,
      },
    ];
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: paymentData,
      success_url: `${process.env.FRONTEND_URL}/payment-success/${userResponse._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      metadata: {
        userId: userResponse._id,
      },
    });

    res.status(200).json({ status: true, url: session.url });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({
      status: false,
      data: null,
      message:
        "Something went wrong while buy premium membership.Please try again later.",
    });
  }
};



const getUserData = async (req, res) => {
    try {
      const payload = req.params;
      const id = payload.id;

      if (!id) {
        throw {
          message: "Required data not received.Please try again later.",
        };
      }
      const userResponse = await UserModel.findById(id);
      if (!userResponse) {
        throw {
          message: "User does not exists.",
        };
      }

  
      res.status(200).json({ status: true, data:userResponse });
    } catch (err) {
      console.log("error", err);
      res.status(500).json({
        status: false,
        data: null,
        message:
          "Something went wrong while buy premium membership.Please try again later.",
      });
    }
  };

module.exports = {
  handleSuccessPayment,
  createCheckoutSession,
  getUserData,
};
