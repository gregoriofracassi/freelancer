import mongoose from "mongoose"

const UniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
})

export default mongoose.model("Uni", UniSchema)
