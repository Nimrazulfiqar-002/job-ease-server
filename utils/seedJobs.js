import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/Job.js";

dotenv.config();

const jobs = [
  { title: "Frontend Developer", company: "Pixel Studio", location: "Remote", skills: ["React", "JavaScript", "CSS", "Git"], description: "Build responsive UIs with React and Tailwind." },
  { title: "Backend Developer", company: "DataForge", location: "Karachi", skills: ["Node.js", "Express", "MongoDB", "API"], description: "Design REST APIs and manage backend services." },
  { title: "Full Stack Developer (MERN)", company: "Nimbus Tech", location: "Remote", skills: ["React", "Node.js", "MongoDB", "Express", "Git"], description: "Own features end to end across the MERN stack." },
  { title: "Data Scientist", company: "InsightIQ", location: "Lahore", skills: ["Python", "ML", "SQL"], description: "Build predictive models from large datasets." },
  { title: "AI Engineer", company: "NeuralWorks", location: "Remote", skills: ["AI", "TensorFlow", "Python"], description: "Train and deploy ML/LLM based products." },
  { title: "QA / SQA Engineer", company: "TestNest", location: "Karachi", skills: ["Manual Testing", "Postman", "JMeter", "Git"], description: "Own manual and automated testing for web apps." },
  { title: "UI/UX Designer", company: "Studio Bloom", location: "Remote", skills: ["Figma", "UI/UX", "CSS"], description: "Design user flows and interfaces for web/mobile." },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Job.deleteMany({});
    await Job.insertMany(jobs);
    console.log(`Seeded ${jobs.length} jobs successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

run();
