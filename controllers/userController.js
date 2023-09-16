const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const UserModel = require("../Models/User");


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

    if (userResponse.isPremium) {
      throw {
        message: "User is already a premium member.",
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
      customer_email: userResponse.email, 
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
  createCheckoutSession,
  getUserData,
};
