const pdfParse = require("pdf-parse");
const { generateInterviewQuestions, evaluateAnswer, generateSessionReportPdf } = require("../services/ai.service");
const InterviewSession = require("../models/interviewSession.model");
const User = require("../models/user.model");

const SESSION_COST = 5;

async function startSession(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (user.credits < SESSION_COST) {
      return res.status(402).json({ message: `Need ${SESSION_COST} credits to start a session.` });
    }

    const { role, experience, mode } = req.body;
    if (!role) return res.status(400).json({ message: "Role is required" });

    let resumeText = "";
    if (req.file) {
      const parsed = await pdfParse(req.file.buffer);
      resumeText = parsed.text;
    }

    const questions = await generateInterviewQuestions({ role, experience: experience || "fresher", mode: mode || "technical", resumeText });

    const session = await InterviewSession.create({
      user: req.user.id,
      role,
      experience: experience || "fresher",
      mode: mode || "technical",
      resumeText,
      questions,
      status: "pending",
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { credits: -SESSION_COST } });

    res.status(201).json({ message: "Session started", session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function submitAnswer(req, res) {
  try {
    const { questionIndex, userAnswer } = req.body;
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const question = session.questions[questionIndex];
    const evaluation = await evaluateAnswer({ question, answer: userAnswer, role: session.role, mode: session.mode });

    session.answers.push({
      questionIndex,
      question,
      userAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      confidence: evaluation.confidence,
      communication: evaluation.communication,
      correctness: evaluation.correctness,
    });

    session.performanceTrend.push(evaluation.score);

    // Rolling average
    const count = session.answers.length;
    const prev = count - 1;
    session.overallScore  = parseFloat(((session.overallScore * prev + evaluation.score) / count).toFixed(1));
    session.confidence    = parseFloat(((session.confidence * prev + evaluation.confidence) / count).toFixed(1));
    session.communication = parseFloat(((session.communication * prev + evaluation.communication) / count).toFixed(1));
    session.correctness   = parseFloat(((session.correctness * prev + evaluation.correctness) / count).toFixed(1));

    await session.save();
    res.json({ evaluation, session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function completeSession(req, res) {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });
    session.status = "completed";
    await session.save();
    res.json({ message: "Session completed", session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getSession(req, res) {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllSessions(req, res) {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-questions -answers -resumeText -performanceTrend");
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function downloadReport(req, res) {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const pdfBuffer = await generateSessionReportPdf(session);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=hiremind_report_${req.params.id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { startSession, submitAnswer, completeSession, getSession, getAllSessions, downloadReport };
