import mongoose from "mongoose"

const AnnouncementSchema = new mongoose.Schema(
  {
    announcementID: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    timeRange: {
      type: String,
      enum: ["fullDay", "halfDayAM", "halfDayPM"],
      default: "fullDay",
      },
    tag: {
      type: String,
      enum: ["holiday", "promo", "others"],
      default: "normal",
    },
    priority: {
      type: String,
      enum: ["normal", "important", "urgent"],
      default: "normal",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
)

// announcementID
AnnouncementSchema.pre("save", async function (next) {
  if (this.isNew && !this.announcementID) {
    const count = await mongoose.models.Announcement.countDocuments()
    this.announcementID = `ANN-${Date.now().toString().slice(-6)}-${count}`
  }
  next()
})

const Announcement = mongoose.model("Announcement", AnnouncementSchema)
export default Announcement
