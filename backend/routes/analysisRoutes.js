import express from "express";
import TestResult from "../models/TestResult.js";

const router = express.Router();

// GET analysis for all students
router.get("/", async (req, res) => {
  try {
    const results = await TestResult.find().populate("studentId", "fullName email");

    // Aggregate counts
    const analysis = {
      PHQ9: { Minimal: 0, Mild: 0, Moderate: 0, Severe: 0 },
      GAD7: { Minimal: 0, Mild: 0, Moderate: 0, Severe: 0 },
      GHQ12: { Minimal: 0, Mild: 0, Moderate: 0, Severe: 0 },
    };

    results.forEach((student) => {
      student.tests.forEach((test) => {
        if (test.testType === "PHQ-9") {
          if (test.score <= 4) analysis.PHQ9.Minimal++;
          else if (test.score <= 9) analysis.PHQ9.Mild++;
          else if (test.score <= 14) analysis.PHQ9.Moderate++;
          else analysis.PHQ9.Severe++;
        }
        if (test.testType === "GAD-7") {
          if (test.score <= 4) analysis.GAD7.Minimal++;
          else if (test.score <= 9) analysis.GAD7.Mild++;
          else if (test.score <= 14) analysis.GAD7.Moderate++;
          else analysis.GAD7.Severe++;
        }
        if (test.testType === "GHQ-12") {
          if (test.score <= 4) analysis.GHQ12.Minimal++;
          else if (test.score <= 9) analysis.GHQ12.Mild++;
          else if (test.score <= 14) analysis.GHQ12.Moderate++;
          else analysis.GHQ12.Severe++;
        }
      });
    });

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
