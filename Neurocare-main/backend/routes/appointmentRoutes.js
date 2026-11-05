import express from "express";
import { bookAppointment, getAppointments, updateAppointmentStatus } from "../controllers/appointmentController.js";

const router = express.Router();

// Book Appointment (studentId passed in body)
router.post("/", bookAppointment);

// Get Appointments
router.get("/student/:studentId", getAppointments);
router.get("/counsellor/:counsellorId", getAppointments);

// Update Appointment Status
router.put("/:id", updateAppointmentStatus);

export default router;
