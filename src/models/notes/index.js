import mongoose from "mongoose"

const NotesSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    contentKey: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    purchasedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Notes", NotesSchema)
