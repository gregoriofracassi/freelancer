import cors from "cors"
import express from "express"
import usersRouter from "./services/users/index.js"
import projectsRouter from "./services/projects/index.js"
import bidsRouter from "./services/bids/index.js"
import feedbacksRouter from "./services/feedbacks/index.js"
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js"

const server = express()
server.use(cors())
server.use(express.json())

server.use("/users", usersRouter)
server.use("/projects", projectsRouter)
server.use("/bids", bidsRouter)
server.use("/feedbacks", feedbacksRouter)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(catchAllErrorHandler)

export default server
