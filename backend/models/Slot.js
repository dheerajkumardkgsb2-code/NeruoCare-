import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  counsellorName: { type: String, required: true },
  counsellorEmail: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  mode: { type: String, required: true },
  meetingLink: { type: String },
  location: { type: String },
  isBooked: { type: Boolean, default: false }
});

const Slot = mongoose.model("Slot", slotSchema);
export default Slot;
