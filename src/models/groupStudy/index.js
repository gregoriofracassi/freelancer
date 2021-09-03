import mongoose from "mongoose"

const GroupStudySchema = new mongoose.Schema({
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      subject: { type: String, required: true },
    },
  ],
})

export default mongoose.model("GroupStudy", GroupStudySchema)
