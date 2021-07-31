import mongoose from "mongoose"
const { Schema, model } = mongoose

const FeedbackSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  written_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  referred_to: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
})

export default model("Feedback", FeedbackSchema)
