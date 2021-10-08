import mongoose from "mongoose"
import socketServer, { server } from "./server.js"
import list from "express-list-endpoints"

const port = process.env.PORT || 3030
const ATLAS_URL = process.env.ATLAS_URL

if (!ATLAS_URL) throw new Error("No Atlas URL specified")

mongoose
  .connect(ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongo")
    socketServer.listen(port, () => {
      console.table(list(server))
      console.log("Server listening on port " + port)
    })
  })
