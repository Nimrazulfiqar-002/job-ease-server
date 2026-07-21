import express from "express";
import { getJobs, recommendJobs } from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/recommend", recommendJobs);

export default router;
