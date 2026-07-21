import express from "express";
import { getResumeSuggestions } from "../controllers/aiController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// protect this so random people can't rack up your Gemini quota
router.post("/suggestions", protect, getResumeSuggestions);

export default router;
