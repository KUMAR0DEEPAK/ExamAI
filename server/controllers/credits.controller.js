import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/user.model.js";
dotenv.config();

const CREDIT_MAP = {
  99: 150,
  200: 450,
  500: 1500,
};

//  Create Order
export const createCreditOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    if (!CREDIT_MAP[amount]) {
      return res.status(400).json({ message: "Invalid credit plan" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//  Verify Payment

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;
    if (!CREDIT_MAP[amount]) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Failed ❌",
      });
    }

    const creditsToAdd = CREDIT_MAP[amount];

    if (!creditsToAdd) {
      return res.status(400).json({ message: "Invalid credit mapping" });
    }
    await User.findByIdAndUpdate(userId, {
      $inc: { credits: creditsToAdd },
    });

    return res.status(200).json({
      success: true,
      message: "Payment Verified & Credits Added ✅",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification error" });
  }
};
