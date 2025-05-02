import Holiday from "../models/holidayModel.js"
import Announcement from "../models/announcementModel.js"
import catchAsync from "../utils/catchAsync.js"

// Helper function to create or update an announcement for a holiday
const createOrUpdateHolidayAnnouncement = async (holiday, userId) => {
  const content = holiday.generateAnnouncementContent()

  const priority = holiday.determineAnnouncementPriority()

  if (holiday.announcement) {
    const existingAnnouncement = await Announcement.findById(holiday.announcement)

    if (existingAnnouncement) {
      existingAnnouncement.title = `Holiday: ${holiday.title}`
      existingAnnouncement.content = content
      existingAnnouncement.dateTime = new Date()
      existingAnnouncement.priority = priority

      await existingAnnouncement.save()
      return existingAnnouncement
    }
  }

  const newAnnouncement = await Announcement.create({
    title: `Holiday: ${holiday.title}`,
    content: content,
    dateTime: new Date(),
    priority: priority,
    createdBy: userId,
  })

  holiday.announcement = newAnnouncement._id
  await holiday.save()

  return newAnnouncement
}

export const createHoliday = catchAsync(async (req, res) => {
  const { title, description, date, isFullDay, startTime, endTime } = req.body

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only administrators can create holidays",
    })
  }

  if (!title || !date) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide title and date for the holiday",
    })
  }

  // Validate that startTime and endTime are provided for partial day holidays
  if (isFullDay === false && (!startTime || !endTime)) {
    return res.status(400).json({
      status: "fail",
      message: "Start time and end time are required for partial day holidays",
    })
  }

  // Validate that endTime is after startTime for partial day holidays
  if (isFullDay === false && new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({
      status: "fail",
      message: "End time must be after start time",
    })
  }

  const holidayData = {
    title,
    description,
    date: new Date(date),
    isFullDay: isFullDay !== false, // Default to true if not specified
    createdBy: req.user.id,
  }

  // Add startTime and endTime only for partial day holidays
  if (isFullDay === false) {
    holidayData.startTime = new Date(startTime)
    holidayData.endTime = new Date(endTime)
  }

  const newHoliday = await Holiday.create(holidayData)

  // Create an announcement for this holiday
  const announcement = await createOrUpdateHolidayAnnouncement(newHoliday, req.user.id)

  res.status(201).json({
    status: "success",
    data: {
      holiday: newHoliday,
      announcement: announcement,
    },
  })
})

export const updateHoliday = catchAsync(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only administrators can update holidays",
    })
  }

  const { title, description, date, isFullDay, startTime, endTime } = req.body

  const holiday = await Holiday.findOne({ holidayID: req.params.id })

  if (!holiday) {
    return res.status(404).json({
      status: "fail",
      message: "Holiday not found",
    })
  }

  // Validate that startTime and endTime are provided if changing to partial day
  if (isFullDay === false && ((!startTime && !holiday.startTime) || (!endTime && !holiday.endTime))) {
    return res.status(400).json({
      status: "fail",
      message: "Start time and end time are required for partial day holidays",
    })
  }

  if (title) holiday.title = title
  if (description !== undefined) holiday.description = description
  if (date) holiday.date = new Date(date)

  if (isFullDay !== undefined) {
    holiday.isFullDay = isFullDay


    if (isFullDay === false) {
      if (startTime) holiday.startTime = new Date(startTime)
      if (endTime) holiday.endTime = new Date(endTime)


      if (holiday.startTime >= holiday.endTime) {
        return res.status(400).json({
          status: "fail",
          message: "End time must be after start time",
        })
      }
    }
  } else {
    if (!holiday.isFullDay) {
      if (startTime) holiday.startTime = new Date(startTime)
      if (endTime) holiday.endTime = new Date(endTime)

      // Validate that endTime is after startTime
      if (holiday.startTime >= holiday.endTime) {
        return res.status(400).json({
          status: "fail",
          message: "End time must be after start time",
        })
      }
    }
  }

  await holiday.save()

  // Update the associated announcement
  const announcement = await createOrUpdateHolidayAnnouncement(holiday, req.user.id)

  res.status(200).json({
    status: "success",
    data: {
      holiday,
      announcement,
    },
  })
})

export const getAllHolidays = catchAsync(async (req, res) => {
  // Add filtering options
  const { from, to } = req.query

  const filter = {}

  if (from || to) {
    filter.date = {}
    if (from) filter.date.$gte = new Date(from)
    if (to) filter.date.$lte = new Date(to)
  }

  const holidays = await Holiday.find(filter).sort({ date: 1 }).populate("announcement")

  res.status(200).json({
    status: "success",
    results: holidays.length,
    data: {
      holidays,
    },
  })
})

export const getHolidayById = catchAsync(async (req, res) => {
  const holiday = await Holiday.findOne({ holidayID: req.params.id }).populate("announcement")

  if (!holiday) {
    return res.status(404).json({
      status: "fail",
      message: "Holiday not found",
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      holiday,
    },
  })
})

export const deleteHoliday = catchAsync(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only administrators can delete holidays",
    })
  }

  const holiday = await Holiday.findOne({ holidayID: req.params.id })

  if (!holiday) {
    return res.status(404).json({
      status: "fail",
      message: "Holiday not found",
    })
  }

  if (holiday.announcement) {
    await Announcement.findByIdAndDelete(holiday.announcement)
  }

  // Delete the holiday
  await Holiday.findOneAndDelete({ holidayID: req.params.id })

  res.status(200).json({
    status: "success",
    message: "Holiday and associated announcement deleted successfully",
  })
})

export const checkIfHoliday = catchAsync(async (req, res) => {
  const { dateTime } = req.query

  if (!dateTime) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a dateTime parameter",
    })
  }

  const checkDate = new Date(dateTime)

  const startOfDay = new Date(checkDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(checkDate)
  endOfDay.setHours(23, 59, 59, 999)

  const holidays = await Holiday.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })

  // Check if any of the holidays cover the requested time
  let isHoliday = false
  let matchingHoliday = null

  for (const holiday of holidays) {
    if (holiday.isFullDay) {
      isHoliday = true
      matchingHoliday = holiday
      break
    } else {
      // For partial day holidays, check if the time falls within the range
      const checkTime = checkDate.getTime()
      if (checkTime >= holiday.startTime.getTime() && checkTime <= holiday.endTime.getTime()) {
        isHoliday = true
        matchingHoliday = holiday
        break
      }
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      isHoliday,
      holiday: matchingHoliday,
    },
  })
})

export const getUpcomingHolidays = catchAsync(async (req, res) => {
  const { limit = 5 } = req.query

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const holidays = await Holiday.find({
    date: { $gte: today },
  })
    .sort({ date: 1 })
    .limit(Number.parseInt(limit))
    .populate("announcement")

  res.status(200).json({
    status: "success",
    results: holidays.length,
    data: {
      holidays,
    },
  })
})

export const refreshHolidayAnnouncements = catchAsync(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only administrators can refresh holiday announcements",
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all upcoming holidays
  const upcomingHolidays = await Holiday.find({
    date: { $gte: today },
  })

  const updatedAnnouncements = []

  // Update announcements for each holiday
  for (const holiday of upcomingHolidays) {
    const announcement = await createOrUpdateHolidayAnnouncement(holiday, req.user.id)
    updatedAnnouncements.push(announcement)
  }

  res.status(200).json({
    status: "success",
    results: updatedAnnouncements.length,
    message: "Holiday announcements refreshed successfully",
    data: {
      announcements: updatedAnnouncements,
    },
  })
})
