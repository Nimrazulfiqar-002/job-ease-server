import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullname: { type: String, default: "" },
    email: { type: String, default: "" },
    phoneNo: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    education: { type: String, default: "" },
    skills: { type: String, default: "" }, // comma separated
    experience: { type: String, default: "" },
    aiSuggestions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
