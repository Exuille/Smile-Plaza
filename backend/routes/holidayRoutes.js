import express from "express"
import {
  createHoliday,
  getAllHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
  checkIfHoliday,
  getUpcomingHolidays,
  refreshHolidayAnnouncements,
} from "../controllers/holidayController.js"
import { protect } from "../controllers/authController.js"

const router = express.Router()

// Protected routes - only authenticated users can view holidays
router.route("/").get(protect, getAllHolidays)
router.route("/upcoming").get(protect, getUpcomingHolidays)
router.route("/check").get(protect, checkIfHoliday)
router.route("/:id").get(protect, getHolidayById)

// Admin-only routes for creating, updating, and deleting holidays
router.route("/create").post(protect, createHoliday)
router.route("/:id").put(protect, updateHoliday)
router.route("/:id").delete(protect, deleteHoliday)
router.route("/refresh-announcements").post(protect, refreshHolidayAnnouncements)

export default router
