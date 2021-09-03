import mongoose from "mongoose"

const TutorSessionSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startTime: {
    type: Date,
    required: true,
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
})

export default mongoose.model("TutorSession", TutorSessionSchema)
