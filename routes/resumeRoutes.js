import express from "express";
import { saveResume, getMyResume } from "../controllers/resumeController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, saveResume);
router.get("/", protect, getMyResume);

export default router;
