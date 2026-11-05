import mongoose from "mongoose";

const testQuestionSchema = new mongoose.Schema({
  testType: { type: String, enum: ["PHQ-9", "GAD-7", "GHQ-12"], required: true },
  questions: [{ type: String, required: true }]
});

export default mongoose.model("TestQuestion", testQuestionSchema);