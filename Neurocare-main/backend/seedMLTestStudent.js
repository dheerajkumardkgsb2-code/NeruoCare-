import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";
import WellnessIntake from "./models/WellnessIntake.js";
import TestResult from "./models/TestResult.js";

const studentDetails = {
  username: "ml_test_student",
  email: "ml.test.student@neurocare.local",
  role: "student",
  isVerified: true,
};
const studentId = "6abd4d284d498874a893b03c";

const intakeDetails = {
  gender: "Male",
  city: "Mumbai",
  cgpa: 7.5,
  academicPressure: 3,
  workPressure: 1,
  studySatisfaction: 3,
  jobSatisfaction: 0,
  sleepDuration: "5-6 hours",
  dietaryHabits: "Moderate",
  degree: "BTech Computer Engineering",
  workStudyHours: 8,
  financialStress: 2,
  familyHistory: false,
};

const answersMatch = (storedAnswers, expectedAnswers) =>
  Array.isArray(storedAnswers) &&
  storedAnswers.length === expectedAnswers.length &&
  storedAnswers.every((answer, index) => answer === expectedAnswers[index]);

async function seed() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("This local test seed cannot run in production.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured in backend/.env");
  }
  if (!process.env.ML_TEST_STUDENT_PASSWORD || process.env.ML_TEST_STUDENT_PASSWORD.length < 6) {
    throw new Error("Set ML_TEST_STUDENT_PASSWORD to a test password of at least 6 characters.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connection successful.");

  const student = await User.findById(studentId);
  if (!student || student.username !== studentDetails.username) {
    throw new Error("The specified ML test student was not found; no account was modified.");
  }

  const emailOwner = await User.findOne({ email: studentDetails.email, _id: { $ne: student._id } });
  if (emailOwner) {
    throw new Error("The test email belongs to another account; no account was modified.");
  }

  student.set({
    ...studentDetails,
    password: await bcrypt.hash(process.env.ML_TEST_STUDENT_PASSWORD, 10),
  });
  await student.save();

  const passwordSuccessfullySet = await bcrypt.compare(
    process.env.ML_TEST_STUDENT_PASSWORD,
    student.password
  );
  if (!passwordSuccessfullySet) {
    throw new Error("The local test password hash could not be verified.");
  }

  console.log(`Student exists: ${Boolean(student)}`);
  console.log(`Username: ${student.username}`);
  console.log(`Email: ${student.email}`);
  console.log(`Role: ${student.role}`);
  console.log(`isVerified: ${student.isVerified === true}`);
  console.log(`Password successfully set: ${passwordSuccessfullySet}`);

  if (process.argv.includes("--account-only")) {
    console.log(`Student _id: ${student._id}`);
    return;
  }

  const existingIntake = await WellnessIntake.exists({ studentId: student._id });
  await WellnessIntake.findOneAndUpdate(
    { studentId: student._id },
    { $set: intakeDetails },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const phqAnswers = [2, 2, 1, 2, 1, 1, 1, 0, 0];
  const gadAnswers = [1, 1, 1, 1, 0, 1, 0];
  const now = Date.now();
  const daysAgo = (days) => new Date(now - days * 24 * 60 * 60 * 1000);
  const expectedAttempts = [
    {
      testType: "PHQ-9",
      answers: phqAnswers,
      score: phqAnswers.reduce((total, answer) => total + answer, 0),
      severity: "Moderate",
      recommendation: "Consider speaking with a counsellor.",
    },
    {
      testType: "GAD-7",
      answers: gadAnswers,
      score: gadAnswers.reduce((total, answer) => total + answer, 0),
      severity: "Mild",
    },
    {
      testType: "PHQ-9",
      answers: [3, 2, 2, 2, 2, 2, 1, 1, 1],
      score: 16,
      severity: "Moderately Severe",
      createdAt: daysAgo(30),
    },
    {
      testType: "PHQ-9",
      answers: [2, 2, 1, 2, 1, 2, 1, 0, 1],
      score: 12,
      severity: "Moderate",
      createdAt: daysAgo(15),
    },
    {
      testType: "PHQ-9",
      answers: [2, 2, 1, 1, 1, 1, 1, 0, 1],
      score: 10,
      severity: "Moderate",
      createdAt: daysAgo(2),
    },
  ];

  let testResult = await TestResult.findOne({ studentId: student._id });
  const testResultExisted = Boolean(testResult);
  if (!testResult) {
    testResult = new TestResult({ studentId: student._id, tests: [] });
  }

  for (const expectedAttempt of expectedAttempts) {
    const existingAttempt = testResult.tests.find(
      (attempt) =>
        attempt.testType === expectedAttempt.testType &&
        answersMatch(attempt.answers, expectedAttempt.answers)
    );

    if (existingAttempt) {
      existingAttempt.score = expectedAttempt.score;
      existingAttempt.severity = expectedAttempt.severity;
      if (expectedAttempt.createdAt) {
        existingAttempt.createdAt = expectedAttempt.createdAt;
      }
      if (expectedAttempt.recommendation !== undefined) {
        existingAttempt.recommendation = expectedAttempt.recommendation;
      }
    } else {
      testResult.tests.push(expectedAttempt);
    }
  }

  await testResult.save();

  const phqAttempts = testResult.tests
    .filter((attempt) => attempt.testType === "PHQ-9")
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));

  console.log(`Student _id: ${student._id}`);
  console.log(`Username: ${student.username}`);
  console.log(`Wellness intake ${existingIntake ? "updated" : "created"}.`);
  console.log(`Test result ${testResultExisted ? "updated" : "created"}.`);
  console.log(`PHQ-9 attempt count: ${phqAttempts.length}`);
  for (const attempt of phqAttempts) {
    console.log(`PHQ-9 ${new Date(attempt.createdAt).toISOString()}: score ${attempt.score}`);
  }
  console.log(`Test endpoint: http://127.0.0.1:5001/api1/ml/risk/${student._id}`);
}

try {
  await seed();
} catch (error) {
  if (error.message === "Set ML_TEST_STUDENT_PASSWORD to a test password of at least 6 characters.") {
    console.error("ML_TEST_STUDENT_PASSWORD is missing or too short; no account was modified.");
  } else {
    console.error(`ML test seed failed (${error.name || "Error"}); no URI or password was printed.`);
  }
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}