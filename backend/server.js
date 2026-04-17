require("dotenv").config();

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const admin = require("firebase-admin");

// =============================
// 🔐 FIREBASE ADMIN SETUP
// =============================
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// =============================
// 🚀 APP SETUP
// =============================
const app = express();
app.use(cors());
app.use(express.json());

// =============================
// 🔐 RAZORPAY SETUP (ENV)
// =============================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// =============================
// 🟢 ROOT ROUTE (HEALTH CHECK)
// =============================
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// =============================
// 💳 CREATE ORDER
// =============================
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount || 2900, // ₹29 default
      currency: "INR"
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({
      success: false,
      error: "Order creation failed"
    });
  }
});

// =============================
// 🔐 VERIFY PAYMENT
// =============================
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId
    } = req.body;

    // 🔒 Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    // ✅ Update user premium status
    if (userId) {
      await db.collection("users").doc(userId).set(
        {
          isPremium: true,
          premiumSince: new Date()
        },
        { merge: true }
      );
    }

    res.json({
      success: true,
      message: "Payment verified & premium activated"
    });

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({
      success: false,
      error: "Verification failed"
    });
  }
});

// =============================
// 🚀 START SERVER
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});