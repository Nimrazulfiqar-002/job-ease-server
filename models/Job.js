import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, default: "Not specified" },
    location: { type: String, default: "Remote" },
    skills: [{ type: String }],
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
