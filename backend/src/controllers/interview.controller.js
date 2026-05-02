const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const InterviewReport = require("../models/interviewReport.model");
const User = require("../models/user.model");

const PLAN_COST = 10;
const RESUME_COST = 5;

async function generateReport(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (user.credits < PLAN_COST) {
      return res.status(402).json({ message: `Insufficient credits. Need ${PLAN_COST} credits to generate a plan.` });
    }

    const { selfDescription, jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ message: "Job description is required" });

    let resumeText = "";
    if (req.file) {
      const parsed = await pdfParse(req.file.buffer);
      resumeText = parsed.text;
    }

    const aiData = await generateInterviewReport({ resume: resumeText, selfDescription, jobDescription });

    const report = await InterviewReport.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...aiData,
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { credits: -PLAN_COST } });

    res.status(201).json({ message: "Interview report generated successfully", interviewReport: report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getReportById(req, res) {
  try {
    const report = await InterviewReport.findOne({ _id: req.params.id, user: req.user.id });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json({ interviewReport: report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllReports(req, res) {
  try {
    const reports = await InterviewReport.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
    res.json({ interviewReports: reports });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function downloadResumePdf(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (user.credits < RESUME_COST) {
      return res.status(402).json({ message: `Need ${RESUME_COST} credits to download resume.` });
    }

    const report = await InterviewReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const pdfBuffer = await generateResumePdf({
      resume: report.resume,
      jobDescription: report.jobDescription,
      selfDescription: report.selfDescription,
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { credits: -RESUME_COST } });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=hiremind_resume_${req.params.id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { generateReport, getReportById, getAllReports, downloadResumePdf };
