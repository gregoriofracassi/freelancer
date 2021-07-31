import mongoose from "mongoose"
import MessageSchema from "../Message/index.js"

const RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "New Chat",
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  chatHistory: {
    type: [MessageSchema],
    default: [],
  },
})

export default mongoose.model("Room", RoomSchema)
