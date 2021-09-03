import mongoose from "mongoose"

const NotesSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  courseYear: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

export default mongoose.model("Notes", NotesSchema)
