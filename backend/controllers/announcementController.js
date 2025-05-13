import Announcement from "../models/announcementModel.js"
import catchAsync from "../utils/catchAsync.js"

export const createAnnouncement = catchAsync(async (req, res) => {
  const { title, content, date, tag, priority, selectedTime } = req.body

  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only administrators can create announcements",
    })
  }

  if (!title || !content) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide title and content for the announcement",
    })
  }

  // Validate priority if provided
  if (priority && !["normal", "important", "urgent"].includes(priority)) {
    return res.status(400).json({
      status: "fail",
      message: "Priority must be one of: normal, important, urgent",
    })
  }

  const announcementDate = date ? new Date(date) : new Date()

  const newAnnouncement = await Announcement.create({
    title,
    content,
    dateTime: announcementDate,
    timeRange: selectedTime,
    priority: priority || "normal",
    tag: tag || "promo",
    createdBy: req.user.id,
  })

  res.status(201).json({
    status: "success",
    data: {
      announcement: newAnnouncement,
    },
  })
})

export const getAllAnnouncements = catchAsync(async (req, res) => {
  // Add filtering by priority
  const { priority, tag } = req.query

  console.log(tag, priority)

  const filter = {}
  if (priority) {
    if (!["normal", "important", "urgent"].includes(priority)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid priority filter. Must be one of: normal, important, urgent",
      })
    }
    filter.priority = priority
  }

  if (tag) {
    if (!["holiday", "promo", "others"].includes(tag)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid tag filter. Must be one of: holiday, promo, others",
      })
    }
    filter.tag = tag
  }

  const pastFilter = {...filter}

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000 (start of today)
  filter.dateTime = { $gt: today };
  pastFilter.dateTime = {$lte: today};

  const announcements = await Announcement.find(filter).sort({dateTime: 1, priority: -1})
  const pastAnnounements = await Announcement.find(pastFilter).sort({dateTime: 1, priority: -1})
  
  console.log(announcements)
  console.log(pastAnnounements)

  const combined = [...announcements, ...pastAnnounements]
  
  res.status(200).json({
    status: "success",
    results: announcements.length,
    data: {
      "announcements": combined,
    },
  })
})

export const getAnnouncementById = catchAsync(async (req, res) => {
  const announcement = await Announcement.findOne({ announcementID: req.params.id })

  if (!announcement) {
    return res.status(404).json({
      status: "fail",
      message: "Announcement not found",
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      announcement,
    },
  })
})

export const updateAnnouncement = catchAsync(async (req, res) => {
  // Check if user is admin
  console.log(req)
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only administrators can update announcements",
    })
  }

  const { title, content, date, tag, priority, timeRange } = req.body

  console.log(date, "aaaa")

  // Validate priority if provided
  if (priority && !["normal", "important", "urgent"].includes(priority)) {
    return res.status(400).json({
      status: "fail",
      message: "Priority must be one of: normal, important, urgent",
    })
  }

  const announcement = await Announcement.findOne({ announcementID: req.params.id })

  if (!announcement) {
    return res.status(404).json({
      status: "fail",
      message: "Announcement not found",
    })
  }

  if (title) announcement.title = title
  if (content) announcement.content = content
  if (date) announcement.dateTime = new Date(date)
  if (timeRange) announcement.timeRange = timeRange
  if (priority) announcement.priority = priority
  if (tag) announcement.tag = tag

  await announcement.save()

  res.status(200).json({
    status: "success",
    data: {
      announcement,
    },
  })
})

export const deleteAnnouncement = catchAsync(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only administrators can delete announcements",
    })
  }

  const announcement = await Announcement.findOneAndDelete({ announcementID: req.params.id })
  if (!announcement) {
    return res.status(404).json({
      status: "fail",
      message: "Announcement not found",
    })
  }

  res.status(200).json({
    status: "success",
    message: "Announcement deleted successfully",
  })
})

export const getAnnouncementsByPriority = catchAsync(async (req, res) => {
  const { priority } = req.params

  if (!["normal", "important", "urgent"].includes(priority)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid priority. Must be one of: normal, important, urgent",
    })
  }

  const announcements = await Announcement.find({ priority }).sort({ dateTime: -1 })

  res.status(200).json({
    status: "success",
    results: announcements.length,
    data: {
      announcements,
    },
  })
})
