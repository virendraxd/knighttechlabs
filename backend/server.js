require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🟢 Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// 🧪 Test POST route
app.post("/test", (req, res) => {
  console.log("Body received:", req.body);

  res.json({
    success: true,
    message: "Test route working"
  });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});