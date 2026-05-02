const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes     = require("./routes/auth.routes");
const interviewRoutes = require("./routes/interview.routes");
const sessionRoutes  = require("./routes/session.routes");
const paymentRoutes  = require("./routes/payment.routes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth",      authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/session",   sessionRoutes);
app.use("/api/payment",   paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
