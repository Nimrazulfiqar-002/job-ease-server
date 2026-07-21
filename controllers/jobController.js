import Job from "../models/Job.js";

export const getJobs = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { title: { $regex: search, $options: "i" } }
      : {};
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Match jobs against a comma-separated skills string, e.g. "React, Node.js, Git"
export const recommendJobs = async (req, res) => {
  try {
    const { skills } = req.query;
    if (!skills) {
      return res.status(400).json({ message: "Pass ?skills=React,Node.js" });
    }

    const userSkills = skills
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const jobs = await Job.find();

    const scored = jobs
      .map((job) => {
        const jobSkills = job.skills.map((s) => s.toLowerCase());
        const matches = jobSkills.filter((s) => userSkills.includes(s));
        return { job, matchCount: matches.length };
      })
      .filter((entry) => entry.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map((entry) => ({ ...entry.job.toObject(), matchCount: entry.matchCount }));

    res.json(scored);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
