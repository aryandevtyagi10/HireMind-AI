const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionIndex: { type: Number },
  question: { type: String },
  userAnswer: { type: String },
  score: { type: Number, min: 0, max: 10, default: 0 },
  feedback: { type: String },
  confidence: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  correctness: { type: Number, default: 0 },
}, { _id: false });

const interviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mode: { type: String, enum: ["technical", "hr"], default: "technical" },
  role: { type: String, required: true },
  experience: { type: String, default: "fresher" },
  resumeText: { type: String },
  questions: [{ type: String }],
  answers: [answerSchema],
  status: { type: String, enum: ["pending", "completed", "incomplete"], default: "pending" },
  overallScore: { type: Number, default: 0 },
  confidence: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  correctness: { type: Number, default: 0 },
  performanceTrend: [{ type: Number }],
}, { timestamps: true });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
