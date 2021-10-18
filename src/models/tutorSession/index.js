import mongoose from "mongoose"

const TutorSessionSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      enum: ["30m", "1h", "1h 30m", "2h", "2h 30m", "3h", "3h 30m", "4h"],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    uni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uni",
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("TutorSession", TutorSessionSchema)
