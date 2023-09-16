const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const stripeMetaDataSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default:false,
    },
    sessionId: {
      type: String,
    },
  },
  { timestamps: true }
);
const OtpModel = mongoose.model("StripeMetaData", stripeMetaDataSchema);


module.exports = OtpModel;