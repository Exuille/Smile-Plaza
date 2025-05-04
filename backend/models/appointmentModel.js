import mongoose from "mongoose"

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted","completed", "cancelled"],
      default: "pending",
    },
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
)

const Appointment = mongoose.model("Appointment", AppointmentSchema)
export default Appointment
