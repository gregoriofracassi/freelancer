import mongoose from "mongoose"

const NotesSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    uni: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Uni",
    },
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1667px-PDF_file_icon.svg.png",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
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
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Notes", NotesSchema)
