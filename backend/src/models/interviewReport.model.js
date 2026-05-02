const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  intention: { type: String, required: true },
  answer: { type: String, required: true },
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  severity: { type: String, enum: ["low", "medium", "high"], required: true },
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  focus: { type: String, required: true },
  tasks: [{ type: String }],
});

const interviewReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jobDescription: { type: String, required: true },
  resume: { type: String },
  selfDescription: { type: String },
  matchScore: { type: Number, min: 0, max: 100 },
  title: { type: String, required: true },
  technicalQuestions: [questionSchema],
  behavioralQuestions: [questionSchema],
  skillGaps: [skillGapSchema],
  preparationPlan: [preparationPlanSchema],
}, { timestamps: true });

module.exports = mongoose.model("InterviewReport", interviewReportSchema);
