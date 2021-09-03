import mongoose from "mongoose"

const CourseSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  uni: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Uni",
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subject",
    },
  ],
})

export default mongoose.model("Course", CourseSchema)
