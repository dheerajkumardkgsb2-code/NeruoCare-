import express from "express";
import { getQuestions, saveTestResult, getStudentTests, getTestReport } from "../controllers/testController.js";
const router = express.Router();

router.get("/questions/:testType", getQuestions);
router.post("/results", saveTestResult);
router.get("/results/:studentId", getStudentTests);
router.get("/results/:studentId/:testId", getTestReport);

export default router;
