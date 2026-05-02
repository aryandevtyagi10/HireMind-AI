const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/user.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLANS = {
  starter: { credits: 150, amount: 10000, name: "Starter Pack" },
  pro:     { credits: 650, amount: 50000, name: "Pro Pack" },
};

async function createOrder(req, res) {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: "Invalid plan" });

    const order = await razorpay.orders.create({
      amount: PLANS[plan].amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json({ orderId: order.id, amount: PLANS[plan].amount, currency: "INR", plan, name: PLANS[plan].name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSig = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const creditsToAdd = PLANS[plan]?.credits || 0;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: creditsToAdd }, plan },
      { new: true }
    ).select("-password");

    res.json({ message: "Payment verified! Credits added.", credits: user.credits, plan: user.plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createOrder, verifyPayment };
