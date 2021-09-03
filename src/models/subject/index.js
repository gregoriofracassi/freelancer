import mongoose from "mongoose"

const SubjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
})

export default mongoose.model("Subject", SubjectSchema)
