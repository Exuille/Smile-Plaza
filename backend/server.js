import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import announcementRoutes from "./routes/announcementRoutes.js"
import holidayRoutes from "./routes/holidayRoutes.js"
import emailRoutes from "./routes/emailServiceRoutes.js";

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
)
app.use(express.json())

// Routes
app.use("/auth", authRoutes)
app.use("/appointment", appointmentRoutes)
app.use("/announcement", announcementRoutes)
app.use("/holiday", holidayRoutes)
app.use("/api/email", emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  })
})

console.log("Connecting to DB using URI:", process.env.URI)

// Database Connection
mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log(" Connected to MongoDB")
  })
  .catch((error) => {
    console.error(" Error connecting to MongoDB:", error.message)
  })

app.listen(port, () => {
  console.log(` Server is running on port ${port}`)
})
