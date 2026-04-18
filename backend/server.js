require("dotenv").config();

const express = require("express");
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

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// Test POST route
app.post("/test", (req, res) => {
  console.log("Body received:", req.body);

  res.json({
    success: true,
    message: "Test route working"
  });
});

// 🔽 DOWNLOAD LIMIT CHECK
app.post("/check-download", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ allowed: false, error: "No userId" });
    }

    const ref = db.collection("downloadLimits").doc(userId);
    const snap = await ref.get();

    let count = 0;

    if (snap.exists) {
      count = snap.data().count || 0;
    }

    // limit reached
    if (count >= 3) {
      return res.json({ allowed: false, count });
    }

    // increment count
    await ref.set(
      { count: count + 1 },
      { merge: true }
    );

    return res.json({ allowed: true, count: count + 1 });

  } catch (err) {
    console.error("Download check error:", err);
    res.status(500).json({ allowed: false });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});