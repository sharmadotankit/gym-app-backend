const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const otpSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
    },
    code: {
      type: String,
    },
  },
  { timestamps: true }
);
const OtpModel = mongoose.model("Otp", otpSchema);


module.exports = OtpModel;