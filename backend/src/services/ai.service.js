const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// ─────────────────────────────────────────
// 🧠 GLOBAL HELPERS (RATE LIMIT + RETRY)
// ─────────────────────────────────────────

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function withRetry(fn, retries = 3) {
  try {
    await delay(1200); // throttle (IMPORTANT)
    return await fn();
  } catch (err) {
    if (err.status === 429 && retries > 0) {
      console.log("Retrying Gemini call...");
      await delay(2000);
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON from Gemini:", text);
    throw new Error("Invalid JSON response from AI");
  }
}

// ─────────────────────────────────────────
// 🧾 1. INTERVIEW REPORT (HireMind-1)
// ─────────────────────────────────────────

const interviewReportSchema = z.object({
  matchScore: z.number(),
  title: z.string(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
You are an expert interviewer.

Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Job Description: ${jobDescription}

Generate structured JSON report.
`;

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
      },
    })
  );

  return safeParse(response.text);
}

// ─────────────────────────────────────────
// 📄 2. PDF GENERATOR
// ─────────────────────────────────────────

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "18mm", bottom: "18mm", left: "14mm", right: "14mm" },
  });

  await browser.close();
  return pdfBuffer;
}

// ─────────────────────────────────────────
// 🧾 3. RESUME PDF (OPTIMIZED)
// ─────────────────────────────────────────

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const schema = z.object({ html: z.string() });

  const prompt = `
Generate ATS resume HTML.

Resume: ${resume || ""}
Self: ${selfDescription || ""}
Job: ${jobDescription}

Return JSON { html }
`;

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(schema),
      },
    })
  );

  const { html } = safeParse(response.text);
  return generatePdfFromHtml(html);
}

// ─────────────────────────────────────────
// ❓ 4. QUESTIONS (CACHED)
// ─────────────────────────────────────────

const questionCache = new Map();

async function generateInterviewQuestions({ role, experience, mode, resumeText }) {
  const key = `${role}-${experience}-${mode}`;

  if (questionCache.has(key)) {
    return questionCache.get(key);
  }

  const schema = z.object({
    questions: z.array(z.string()).length(5),
  });

  const prompt = `
Generate 5 ${mode} questions for ${experience} ${role}.
${resumeText ? resumeText.substring(0, 500) : ""}
`;

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(schema),
      },
    })
  );

  const { questions } = safeParse(response.text);

  questionCache.set(key, questions);
  return questions;
}

// ─────────────────────────────────────────
// 🔥 5. BATCH EVALUATION (MAJOR FIX)
// ─────────────────────────────────────────

async function evaluateAllAnswers({ qaList, role, mode }) {
  const schema = z.object({
    results: z.array(
      z.object({
        score: z.number(),
        feedback: z.string(),
        confidence: z.number(),
        communication: z.number(),
        correctness: z.number(),
      })
    ),
  });

  const prompt = `
Evaluate answers.

Role: ${role}
Mode: ${mode}

${qaList
  .map(
    (qa, i) => `
Q${i + 1}: ${qa.question}
A${i + 1}: ${qa.answer || "No answer"}
`
  )
  .join("\n")}

Return JSON results.
`;

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(schema),
      },
    })
  );

  return safeParse(response.text);
}

// ─────────────────────────────────────────
// 📊 6. SESSION REPORT PDF
// ─────────────────────────────────────────

async function generateSessionReportPdf(session) {
  const { role, mode, answers } = session;

  const html = `
  <html>
    <body>
      <h1>HireMind Report</h1>
      <h3>${role} (${mode})</h3>
      ${answers
        .map(
          (a, i) => `
        <div>
          <p><b>Q${i + 1}:</b> ${a.question}</p>
          <p><b>Score:</b> ${a.score}</p>
          <p>${a.feedback}</p>
        </div>
      `
        )
        .join("")}
    </body>
  </html>
  `;

  return generatePdfFromHtml(html);
}

// ─────────────────────────────────────────
// 🚀 EXPORTS
// ─────────────────────────────────────────

module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generateInterviewQuestions,
  evaluateAllAnswers, // ✅ NEW (IMPORTANT)
  generateSessionReportPdf,
};