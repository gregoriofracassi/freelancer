import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
  },
})

export const MessageModel = mongoose.model("Message", MessageSchema)

export default MessageSchema
