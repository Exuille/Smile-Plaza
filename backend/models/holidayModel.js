import mongoose from "mongoose"

const HolidaySchema = new mongoose.Schema(
  {
    holidayID: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    isFullDay: {
      type: Boolean,
      default: true,
    },
    startTime: {
      type: Date,
      // Required only if isFullDay is false
      validate: {
        validator: function (value) {
          return this.isFullDay || value != null
        },
        message: "Start time is required for partial day holidays",
      },
    },
    endTime: {
      type: Date,
      // Required only if isFullDay is false
      validate: {
        validator: function (value) {
          return this.isFullDay || value != null
        },
        message: "End time is required for partial day holidays",
      },
      // Validate that endTime is after startTime
      validate: {
        validator: function (value) {
          return this.isFullDay || !this.startTime || value > this.startTime
        },
        message: "End time must be after start time",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Reference to the associated announcement
    announcement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announcement",
    },
  },
  { timestamps: true },
)

// Generate a unique holidayID before saving
HolidaySchema.pre("save", async function (next) {
  if (this.isNew && !this.holidayID) {
    const count = await mongoose.models.Holiday.countDocuments()
    this.holidayID = `HOL-${Date.now().toString().slice(-6)}-${count}`
  }
  next()
})

// Method to check if a given datetime falls within this holiday
HolidaySchema.methods.isDateTimeHoliday = function (dateTime) {
  const checkDate = new Date(dateTime)

  // Check if the date matches (ignoring time)
  const holidayDate = new Date(this.date)
  const sameDate =
    checkDate.getFullYear() === holidayDate.getFullYear() &&
    checkDate.getMonth() === holidayDate.getMonth() &&
    checkDate.getDate() === holidayDate.getDate()

  if (!sameDate) return false

  // If it's a full day holiday, return true
  if (this.isFullDay) return true

  // If it's a partial day, check if the time falls within the range
  const checkTime = checkDate.getTime()
  return checkTime >= this.startTime.getTime() && checkTime <= this.endTime.getTime()
}

HolidaySchema.methods.generateAnnouncementContent = function () {
  const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  const formattedDate = this.date.toLocaleDateString("en-US", dateOptions)

  let content = ""

  if (this.isFullDay) {
    content = `Please be informed that our clinic will be closed on ${formattedDate} due to ${this.title}.`

    if (this.description) {
      content += ` ${this.description}`
    }

    content += " We apologize for any inconvenience and appreciate your understanding."
  } else {
    const startTimeStr = this.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    const endTimeStr = this.endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

    content = `Please be informed that our clinic will be closed on ${formattedDate} from ${startTimeStr} to ${endTimeStr} due to ${this.title}.`

    if (this.description) {
      content += ` ${this.description}`
    }

    content += ". We apologize for any inconvenience and appreciate your understanding."
  }

  return content
}

// Method to determine announcement priority based on proximity
HolidaySchema.methods.determineAnnouncementPriority = function () {
  const today = new Date()
  const daysUntilHoliday = Math.ceil((this.date - today) / (1000 * 60 * 60 * 24))

  if (daysUntilHoliday <= 3) {
    return "urgent" // Urgent for holidays within 3 days
  } else if (daysUntilHoliday <= 7) {
    return "important" // Important for holidays within a week
  } else {
    return "normal" 
  }
}

const Holiday = mongoose.model("Holiday", HolidaySchema)
export default Holiday
