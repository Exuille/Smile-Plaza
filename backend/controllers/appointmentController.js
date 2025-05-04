import Appointment from "../models/appointmentModel.js"
import Holiday from "../models/holidayModel.js"
import catchAsync from "../utils/catchAsync.js"

export const createAppointment = catchAsync(async (req, res) => {
  const { selectedDate, selectedTimeSlot, service } = req.body
  const patient = req.user?.id

  if (!patient) {
    return res.status(401).json({
      status: "fail",
      message: "Please login first",
    })
  }

  if (!selectedDate || !selectedTimeSlot) {
    return res.status(400).json({
      status: "fail",
      message: "Please select both date and time",
    })
  }

  if (!service) {
    return res.status(400).json({
      status: "fail",
      message: "Please select a service",
    })
  }

  // Combine selected date and time into one Date object
  const appointmentDate = new Date(`${selectedDate}T${convertTo24HourTime(selectedTimeSlot)}:00`)

  if (appointmentDate < new Date()) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot book an appointment in the past",
    })
  }

  // Check for holiday
  const startOfDay = new Date(appointmentDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(appointmentDate)
  endOfDay.setHours(23, 59, 59, 999)

  const holidays = await Holiday.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })

  for (const holiday of holidays) {
    if (holiday.isFullDay) {
      return res.status(400).json({
        status: "fail",
        message: `Cannot book an appointment on a holiday: ${holiday.title}`,
      })
    } else {
      const appointmentTime = appointmentDate.getTime()
      if (
        appointmentTime >= holiday.startTime.getTime() &&
        appointmentTime <= holiday.endTime.getTime()
      ) {
        return res.status(400).json({
          status: "fail",
          message: `Cannot book an appointment during holiday hours: ${holiday.title}`,
        })
      }
    }
  }

  const existingAppointment = await Appointment.findOne({
    dateTime: appointmentDate,
    status: "pending",
  })

  if (existingAppointment) {
    return res.status(409).json({
      status: "fail",
      message: "This time slot is already taken. Please choose another.",
    })
  }

  const newAppointment = await Appointment.create({
    patient,
    dateTime: appointmentDate,
    service,
    status: "pending",
  })

  res.status(201).json({
    status: "success",
    data: {
      appointment: newAppointment,
    },
  })
})

function convertTo24HourTime(time12h) {
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')

  hours = parseInt(hours, 10)
  if (modifier === 'PM' && hours !== 12) hours += 12
  if (modifier === 'AM' && hours === 12) hours = 0

  return `${String(hours).padStart(2, '0')}:${minutes}`
}

export const cancelAppointment = catchAsync(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)

  if (!appointment) {
    return res.status(404).json({ status: "fail", message: "Appointment not found" })
  }

  if (req.user.role !== "admin" && appointment.patient.toString() !== req.user.id) {
    return res.status(403).json({ status: "fail", message: "Not authorized to cancel this appointment" })
  }

  appointment.status = "cancelled"
  await appointment.save()

  res.status(200).json({ status: "success", data: { appointment } })
})

export const getMyAppointments = catchAsync(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user.id })

  if (!appointments) {
    return res.status(404).json({ status: "fail", message: "No appointments found" })
  }

  res.status(200).json({ status: "success", results: appointments.length, data: { appointments } })
})

export const getAppointments = catchAsync(async (req, res) => {
  let appointments
  if (req.user.role === "admin") {
    appointments = await Appointment.find().populate("patient")
  } else {
    appointments = await Appointment.find({ patient: req.user.id })
  }

  res.status(200).json({ status: "success", results: appointments.length, data: { appointments } })
})

export const getAppointmentById = catchAsync(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate("patient")

  if (!appointment) {
    return res.status(404).json({ status: "fail", message: "Appointment not found" })
  }

  if (req.user.role !== "admin" && appointment.patient._id.toString() !== req.user.id) {
    return res.status(403).json({ status: "fail", message: "Not authorized to view this appointment" })
  }

  res.status(200).json({ status: "success", data: { appointment } })
})

export const updateAppointment = catchAsync(async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!updated) {
    return res.status(404).json({ status: "fail", message: "Appointment not found" })
  }

  res.status(200).json({ status: "success", data: { appointment: updated } })
})

export const getAppointmentMetrics = catchAsync(async (req, res) => {
  const match = {}

  if (req.query.status) {
    match.status = req.query.status
  }

  if (req.user.role !== "admin") {
    match.patient = req.user.id
  }

  const appointments = await Appointment.find(match)

  const counts = await Appointment.aggregate([
    {
      $match: req.user.role === "admin"
        ? {}
        : { patient: req.user._id },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])

  const statusCounts = {
    pending: 0,
    completed: 0,
    cancelled: 0,
  }

  counts.forEach((item) => {
    statusCounts[item._id] = item.count
  })

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: {
      appointments,
      counts: statusCounts,
    },
  })
})

export const getAvailableTimes = catchAsync(async (req, res) => {
  const { selectedDate } = req.body

  if (!selectedDate) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a date",
    })
  }

  const selectedDateObj = new Date(selectedDate)
  const startOfDay = new Date(selectedDateObj)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(selectedDateObj)
  endOfDay.setHours(23, 59, 59, 999)

  const appointments = await Appointment.find({
    dateTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $ne: 'cancelled' },
  })

  const occupiedTimes = appointments.map((appt) => {
    const apptDate = new Date(appt.dateTime)
    return apptDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  })

  const allTimeSlots = []
  const baseTime = new Date(selectedDateObj)
  baseTime.setHours(8, 0, 0, 0)

  while (baseTime.getHours() < 17 || (baseTime.getHours() === 17 && baseTime.getMinutes() === 0)) {
    const hour = baseTime.getHours()
    if (hour === 12) {
      baseTime.setHours(13, 0)
      continue
    }

    const slot = baseTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    allTimeSlots.push(slot)
    baseTime.setMinutes(baseTime.getMinutes() + 30)
  }

  const availableTimeSlots = allTimeSlots.filter(time => !occupiedTimes.includes(time))

  res.status(200).json({
    status: "success",
    availableTimes: availableTimeSlots,
  })
})
