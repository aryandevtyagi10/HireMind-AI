const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already taken"],
    required: [true, "Username is required"],
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    unique: [true, "Account already exists with this email"],
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  credits: {
    type: Number,
    default: 100,
  },
  plan: {
    type: String,
    enum: ["free", "starter", "pro"],
    default: "free",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
