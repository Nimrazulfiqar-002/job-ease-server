import Resume from "../models/Resume.js";

// Save or update the logged-in user's resume (one resume per user, kept simple)
export const saveResume = async (req, res) => {
  try {
    const data = { ...req.body, user: req.userId };

    const resume = await Resume.findOneAndUpdate(
      { user: req.userId },
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    if (!resume) return res.status(404).json({ message: "No resume found yet" });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
