import express from "express";
import { createSlot, getSlots, updateSlot, deleteSlot } from "../controllers/slotController.js";
import {protectRoute} from "../middelware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute,getSlots);
router.post("/", protectRoute,createSlot);
router.put("/:id", updateSlot);
router.delete("/:id", deleteSlot);

export default router;
