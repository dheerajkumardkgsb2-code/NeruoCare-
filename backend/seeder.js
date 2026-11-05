import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import TestQuestion from "./models/TestQuestion.js";

dotenv.config();
connectDB();

const seedQuestions = async () => {
  try {
    await TestQuestion.deleteMany();

    const phq9 = [
      "Little interest or pleasure in doing usual activities?",
      "Feeling down, depressed, or hopeless?",
      "Trouble falling/staying asleep or sleeping too much?",
      "Feeling tired or having little energy?",
      "Changes in appetite?",
      "Feeling bad about yourself or like a failure?",
      "Difficulty concentrating?",
      "Moving/speaking slowly or feeling restless?",
      "Thoughts of self-harm or death?"
    ];

    const gad7 = [
      "Feeling nervous, anxious, or on edge?",
      "Unable to control worrying?",
      "Worrying too much about different matters?",
      "Trouble relaxing?",
      "Restlessness?",
      "Easily irritated or annoyed?",
      "Feeling afraid something terrible might happen?"
    ];

    const ghq12 = [
      "Able to concentrate on tasks?",
      "Lost sleep due to worry?",
      "Feeling useful in daily life?",
      "Capable in making decisions?",
      "Feeling under pressure or strain?",
      "Unable to overcome difficulties?",
      "Enjoying day-to-day activities?",
      "Feeling confident facing problems?",
      "Feeling unhappy or depressed?",
      "Lost confidence in yourself?",
      "Feeling worthless or inadequate?",
      "Feeling happy overall?"
    ];

    await TestQuestion.create([
      { testType: "PHQ-9", questions: phq9 },
      { testType: "GAD-7", questions: gad7 },
      { testType: "GHQ-12", questions: ghq12 }
    ]);

    console.log("Test questions seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedQuestions();
