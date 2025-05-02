import express from "express"
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByPriority,
} from "../controllers/announcementController.js"
import { protect } from "../controllers/authController.js"

const router = express.Router()

// Protected routes - only authenticated users can view announcements
router.route("/").get(protect, getAllAnnouncements)
router.route("/:id").get(protect, getAnnouncementById)
router.route("/priority/:priority").get(protect, getAnnouncementsByPriority)

// Admin-only routes for creating, updating, and deleting announcements
router.route("/create").post(protect, createAnnouncement)
router.route("/:id").put(protect, updateAnnouncement)
router.route("/:id").delete(protect, deleteAnnouncement)

export default router
