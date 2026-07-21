import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazily create the client so a missing key doesn't crash the whole server on boot
let genAI = null;
const getClient = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from your .env file");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// Fallback rule-based suggestions if Gemini call fails or key isn't set yet.
// This keeps the app usable while you're waiting on API access / hitting quota.
const fallbackSuggestions = ({ skills = "", experience = "" }) => {
  const suggestions = [];
  const s = skills.toLowerCase();
  const e = experience.toLowerCase();

  if (!s.includes("git")) suggestions.push("Consider adding Git/version control to your skills.");
  if (!s.includes("api")) suggestions.push("Mention experience with REST or GraphQL APIs.");
  if (!e.includes("project")) suggestions.push("Describe at least one concrete project with measurable impact.");
  if (!e.includes("team")) suggestions.push("Mention any teamwork or collaboration experience.");
  if (suggestions.length === 0) suggestions.push("Your resume looks solid — consider quantifying results with numbers (%, time saved, users reached).");

  return suggestions;
};

export const getResumeSuggestions = async (req, res) => {
  const { fullname, skills, experience, education } = req.body;

  if (!skills && !experience) {
    return res.status(400).json({ message: "Skills or experience is required to generate suggestions" });
  }

  const prompt = `You are a professional resume reviewer. Based on the candidate details below, give 4-6 short, specific, actionable bullet-point suggestions to improve their resume. Do not repeat the input back. Reply with ONLY a JSON array of strings, nothing else.

Name: ${fullname || "N/A"}
Education: ${education || "N/A"}
Skills: ${skills || "N/A"}
Experience: ${experience || "N/A"}`;

  try {
    const client = getClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const cleaned = text.replace(/```json|```/g, "").trim();
    let suggestions;
    try {
      suggestions = JSON.parse(cleaned);
    } catch {
      // Model didn't return clean JSON — split by lines as a fallback parse
      suggestions = cleaned
        .split("\n")
        .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
        .filter(Boolean);
    }

    return res.json({ suggestions, source: "gemini" });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    // Don't fail the request — degrade gracefully so the UI still works
    return res.json({
      suggestions: fallbackSuggestions({ skills, experience }),
      source: "fallback",
      note: "AI service unavailable, showing rule-based suggestions instead.",
    });
  }
};
