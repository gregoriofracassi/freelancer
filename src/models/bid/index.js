import mongoose from "mongoose"
const { Schema, model } = mongoose

const BidSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
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

export default model("Bid", BidSchema)
