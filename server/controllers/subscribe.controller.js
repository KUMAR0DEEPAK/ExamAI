import Subscriber from "../models/subscriber.model.js";

export const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already subscribed",
      });
    }

    await Subscriber.create({ email });

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error("Subscribe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};