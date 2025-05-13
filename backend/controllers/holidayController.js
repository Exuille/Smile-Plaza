import Holiday from "../models/holidayModel.js"
import Announcement from "../models/announcementModel.js"
import Appointment from "../models/appointmentModel.js" // Added import for Appointment model
import catchAsync from "../utils/catchAsync.js"

// Helper function to create or update an announcement for a holiday
const createOrUpdateHolidayAnnouncement = async (holiday, userId) => {
  const halfDayAMstartTime = "08:00";


  // Generate announcement content
  const content = holiday.generateAnnouncementContent()

  // Determine priority based on how soon the holiday is
  const priority = holiday.determineAnnouncementPriority()


  // If there's already an associated announcement, update it
  if (holiday.announcement) {
    const existingAnnouncement = await Announcement.findById(holiday.announcement)

    console.log(holiday)
    let timeRange
    if (holiday.isFullDay == true) {
      timeRange = "fullDay"
    } else {
      const time = holiday.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      if (time == halfDayAMstartTime) {
        timeRange = "halfDayAM"
      } else {
        timeRange = "halfDayPM"
      }
    }

    if (existingAnnouncement) {
      existingAnnouncement.title = holiday.title
      existingAnnouncement.content = holiday.description
      existingAnnouncement.dateTime = holiday.date
      existingAnnouncement.priority = priority
      existingAnnouncement.timeRange = timeRange

      await existingAnnouncement.save()
      return existingAnnouncement
    }
  }
  let timeRange;
  if (holiday.isFullDay == true) {
    timeRange = "fullDay"
  } else {
    const time = holiday.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log(time)
    timeRange = time == halfDayAMstartTime ? "halfDayAM" : "halfDayPM"
  }

  const newHolidayData = {
    title: `Holiday: ${holiday.title}`,
    content,
    dateTime: holiday.date,
    timeRange,
    priority: priority,
    tag: "holiday",
    createdBy: userId,
  }

  // Otherwise, create a new announcement
  const newAnnouncement = await Announcement.create(newHolidayData);

  // Update the holiday with the announcement reference
  holiday.announcement = newAnnouncement._id
  await holiday.save()

  return newAnnouncement
}

// Helper function to cancel appointments affected by a holiday
const cancelAffectedAppointments = async (holiday, adminId) => {
  const holidayDate = new Date(holiday.date)
  const startOfDay = new Date(holidayDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(holidayDate)
  endOfDay.setHours(23, 59, 59, 999)

  // Find appointments on the holiday date
  let appointmentQuery = {
    dateTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: "pending", // Only cancel pending appointments
  }

  // For partial day holidays, refine the query to only include appointments during the holiday hours
  if (!holiday.isFullDay) {
    appointmentQuery = {
      dateTime: {
        $gte: holiday.startTime,
        $lte: holiday.endTime,
      },
      status: "pending",
    }
  }

  const affectedAppointments = await Appointment.find(appointmentQuery).populate("patient")

  // Cancel each appointment
  const cancelledAppointments = []
  for (const appointment of affectedAppointments) {
    appointment.status = "cancelled"
    appointment.cancellationReason = `Automatically cancelled due to holiday: ${holiday.title}`
    await appointment.save()
    cancelledAppointments.push(appointment)
  }

  // If there are cancelled appointments, create an announcement about it
  if (cancelledAppointments.length > 0) {
    const formattedDate = holidayDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    let timeInfo = ""
    if (!holiday.isFullDay) {
      const startTimeStr = holiday.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      const endTimeStr = holiday.endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      timeInfo = ` from ${startTimeStr} to ${endTimeStr}`
    }

    await Announcement.create({
      title: `Appointments Cancelled: ${holiday.title}`,
      content: `Due to the upcoming holiday (${holiday.title}), all appointments scheduled for ${formattedDate}${timeInfo} have been automatically cancelled. Please reschedule your appointment for another day. We apologize for any inconvenience.`,
      dateTime: new Date(),
      priority: "urgent",
      createdBy: adminId,
    })
  }

  return cancelledAppointments
}

export const createHoliday = catchAsync(async (req, res) => {
  const { title, description, date, isFullDay, startTime, endTime } = req.body

  // Check if user is admin
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
    holidayData.startTime = new Date(date + "T" + startTime)
    holidayData.endTime = new Date(date + "T" + endTime)
  }

  const newHoliday = await Holiday.create(holidayData)

  // Create an announcement for this holiday
  const announcement = await createOrUpdateHolidayAnnouncement(newHoliday, req.user.id)

  // Cancel affected appointments
  const cancelledAppointments = await cancelAffectedAppointments(newHoliday, req.user.id)

  res.status(201).json({
    status: "success",
    data: {
      holiday: newHoliday,
      announcement: announcement,
      cancelledAppointments: cancelledAppointments.length,
    },
  })
})

export const updateHoliday = catchAsync(async (req, res) => {
  // Check if user is admin

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only administrators can update holidays",
    })
  }

  const { title, description, date, isFullDay, startTime, endTime } = req.body

  const holiday = await Holiday.findOne({ announcement: req.params.id })

  if (!holiday) {
    return res.status(404).json({
      status: "fail",
      message: "Holiday not found",
    })
  }


  // Store original values to check if we need to cancel appointments
  const originalDate = new Date(holiday.date)
  const originalIsFullDay = holiday.isFullDay
  const originalStartTime = holiday.startTime ? new Date(holiday.startTime) : null
  const originalEndTime = holiday.endTime ? new Date(holiday.endTime) : null

  // Validate that startTime and endTime are provided if changing to partial day
  if (isFullDay === false && ((!startTime && !holiday.startTime) || (!endTime && !holiday.endTime))) {
    return res.status(400).json({
      status: "fail",
      message: "Start time and end time are required for partial day holidays",
    })
  }

  // Update fields if provided
  if (title) holiday.title = title
  if (description !== undefined) holiday.description = description
  if (date) holiday.date = new Date(date)

  // Handle isFullDay changes
  if (isFullDay !== undefined) {
    holiday.isFullDay = isFullDay

    // If changing to full day, we can keep the existing times
    // If changing to partial day, we need times
    if (isFullDay === false) {
      if (startTime) holiday.startTime = new Date(date + "T" + startTime)
      if (endTime) holiday.endTime = new Date(date + "T" + endTime)

      // Validate that endTime is after startTime
      if (holiday.startTime >= holiday.endTime) {
        return res.status(400).json({
          status: "fail",
          message: "End time must be after start time",
        })
      }
    }
  } else {
    // If not changing isFullDay but updating times for a partial day holiday
    if (!holiday.isFullDay) {
      if (startTime) holiday.startTime = new Date(date + "T" + startTime)
      if (endTime) holiday.endTime = new Date(date + "T" + endTime)

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

  // Check if we need to cancel appointments
  let cancelledAppointments = []

  // If date changed, or changed from partial day to full day, or expanded time range
  const dateChanged =
    date &&
    (holiday.date.getDate() !== originalDate.getDate() ||
      holiday.date.getMonth() !== originalDate.getMonth() ||
      holiday.date.getFullYear() !== originalDate.getFullYear())

  const expandedCoverage =
    // Changed from partial to full day
    (originalIsFullDay === false && holiday.isFullDay === true) ||
    // Expanded time range for partial day
    (originalIsFullDay === false &&
      holiday.isFullDay === false &&
      ((originalStartTime && holiday.startTime && holiday.startTime < originalStartTime) ||
        (originalEndTime && holiday.endTime && holiday.endTime > originalEndTime)))

  if (dateChanged || expandedCoverage) {
    cancelledAppointments = await cancelAffectedAppointments(holiday, req.user.id)
  }

  res.status(200).json({
    status: "success",
    data: {
      holiday,
      announcement,
      cancelledAppointments: cancelledAppointments.length,
    },
  })
})

// Keep the rest of the controller functions unchanged
export const getAllHolidays = catchAsync(async (req, res) => {
  // Add filtering options
  const { from, to } = req.query

  const filter = {}

  // Filter by date range if provided
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
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only administrators can delete holidays",
    })
  }

  const holiday = await Holiday.findOne({ announcement: req.params.id })

  if (!holiday) {
    return res.status(404).json({
      status: "fail",
      message: "Holiday not found",
    })
  }

  // Delete the associated announcement if it exists
  if (holiday.announcement) {
    await Announcement.findByIdAndDelete(holiday.announcement)
  }

  // Delete the holiday
  await Holiday.findOneAndDelete({ announcement: req.params.id })

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

  // Find all holidays on the same date (ignoring time)
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
