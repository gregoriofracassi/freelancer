import mongoose from "mongoose"
const { Schema, model } = mongoose

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  employer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
})

export default model("Project", ProjectSchema)
